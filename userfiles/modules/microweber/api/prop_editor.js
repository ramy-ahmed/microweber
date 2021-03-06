mw.propEditor = {
    addInterface:function(name, func){
        this.interfaces[name] = this.interfaces[name] || func;
    },
    helpers:{
        wrapper:function(){
            var el = document.createElement('div');
            el.className = 'mw-ui-field-holder prop-ui-field-holder';
            return el;
        },
        quatroWrapper:function(){
            var el = document.createElement('div');
            el.className = 'prop-ui-field-quatro';
            return el;
        },
        label:function(content){
            var el = document.createElement('label');
            el.className = 'mw-ui-label prop-ui-label';
            el.innerHTML = content;
            return el;
        },
        button:function(content){
            var el = document.createElement('button');
            el.className = 'mw-ui-btn';
            el.innerHTML = content;
            return el;
        },
        field: function(val, type, options){
            type = type || 'text';
            if(type === 'select'){
                var el = document.createElement('select');
                if(options && options.length){
                    var option = document.createElement('option');
                        option.innerHTML = 'Choose...';
                        option.value = '';
                        el.appendChild(option);
                    for(var i=0;i<options.length;i++){
                        var option = document.createElement('option');
                        option.innerHTML = options[i];
                        option.value = options[i];
                        el.appendChild(option);
                    }
                }
            }
            else{
                var el = document.createElement('input');
                el.type = type
            }

            el.className = 'mw-ui-field prop-ui-field';
            el.value = val;

            return el;
        },
        fieldPack:function(label, type){
            var field = mw.propEditor.helpers.field('', type);
            var holder = mw.propEditor.helpers.wrapper();
            label = mw.propEditor.helpers.label(label);
            holder.appendChild(label)
            holder.appendChild(field);
            return{
                label:label,
                holder:holder,
                field:field
            }
        }
    },
    rend:function(element, rend){
        for(var i=0;i<rend.length;i++){
            element.appendChild(rend[i].node);
        }
    },
    schema:function(options){
        this.setSchema = function(schema){
            this.options.schema = schema;
            this._rend = [];
            this._valSchema = this._valSchema || {};
            for(var i =0; i< this.options.schema.length;i++){
                var item = this.options.schema[i];
                if(typeof this._valSchema[item.id] === 'undefined'){
                    this._rend.push(new mw.propEditor.interfaces[item.interface](this, item));
                    if(item.id){
                        this._valSchema[item.id] = this._valSchema[item.id] || ''
                    }
                }
            }
            this.options.element.innerHTML = '';
            mw.propEditor.rend(this.options.element, this._rend)
        };
        this.updateSchema = function(schema){
            for(var i =0; i<schema.length;i++){
                var item = schema[i];
                if(typeof this._valSchema[item.id] === 'undefined'){
                    this.options.schema.push(item);
                    var create = new mw.propEditor.interfaces[item.interface](this, item)
                    this._rend.push(create);
                    if(item.id){
                        this._valSchema[item.id] = this._valSchema[item.id] || ''
                    }
                    this.options.element.appendChild(create.node);
                }
            }
        };
        this.setValue = function(val){
            if(!val){
                return;
            }
            for(var i in val){
                var rend = this.getRendById(i);
                if(!!rend){
                    rend.setValue(val[i])
                }
            }
        };
        this.getValue = function(){
            return this._valSchema;
        };
        this.getRendById = function(id){
            for(var i in this._rend){
                if(this._rend[i].id === id){
                    return this._rend[i]
                }
            }
        };
        this.options = options;
        this.options.element = typeof this.options.element === 'string' ? document.querySelector(options.element) : this.options.element;

        this.setSchema(this.options.schema)

    },
    interfaces:{
        quatro:function(proto, config){
            //"2px 4px 8px 122px"
            var holder = mw.propEditor.helpers.quatroWrapper();

            for(var i = 0; i<4; i++){
                var item = mw.propEditor.helpers.fieldPack(config.label[i], 'number');
                holder.appendChild(item.holder);
                item.field.oninput = function(){
                    var final = '';
                    var all = holder.querySelectorAll('input'), i = 0;
                    for( ; i<all.length; i++){
                        var unit = all[i].dataset.unit || '';
                        final+= ' ' + all[i].value + unit ;
                    }
                    proto._valSchema[config.id] = final.trim();
                     $(proto).trigger('change', [config.id, final.trim()]);
                }
            }


                this.node = holder;
                this.setValue = function(value){
                    value = value.trim();
                    var arr = value.split(' ');
                    var all = holder.querySelectorAll('input'), i = 0;
                    for( ; i<all.length; i++){
                        all[i].value = parseInt(arr[i], 10);
                        var unit = arr[i].replace(/[0-9]/g, '');
                        all[i].dataset.unit = unit;
                    }
                    proto._valSchema[config.id] = value;
                };

                this.id = config.id

        },
        hr:function(proto, config){
            var el = document.createElement('hr');
            el.className = ' ';
            this.node = el;
        },
        block:function(proto, config){
            var el = document.createElement('div');
            el.innerHTML = config.content;
            this.node = el
        },
        size:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'number');
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            field.oninput = function(){
                proto._valSchema[config.id] = this.value + this.dataset.unit;
                $(proto).trigger('change', [config.id, this.value + this.dataset.unit]);
            };

            this.node = holder
            this.setValue = function(value){
                field.value = parseInt(value, 10);
                proto._valSchema[config.id] = value;
                var unit = value.replace(/[0-9]/g, '');
                field.dataset.unit = unit;
            };
            this.id=config.id

        },
        text:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'text');
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            field.oninput = function(){
                proto._valSchema[config.id] = this.value;
                $(proto).trigger('change', [config.id, this.value]);
            }
            this.node = holder;
            this.setValue = function(value){
                field.value = value;
                proto._valSchema[config.id] = value
            };
            this.id = config.id;
        },
        number:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'number');
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            field.oninput = function(){
                proto._valSchema[config.id] = this.value;
                $(proto).trigger('change', [config.id, this.value]);
            }
            this.node = holder;
            this.setValue=function(value){
                field.value = parseInt(value, 10);
                proto._valSchema[config.id] = value
            },
            this.id=config.id;
        },
        color:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'color');
            if(field.type !== 'color'){
                mw.colorPicker({
                    element:field,
                    onchange:function(){
                        $(proto).trigger('change', [config.id, field.value]);
                    }
                });
            }
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            field.oninput = function(){
                proto._valSchema[config.id] = this.value;
                $(proto).trigger('change', [config.id, this.value]);
            }
            this.node = holder;
            this.setValue = function(value){
                field.value = value;
                proto._valSchema[config.id] = value
            };
            this.id = config.id
        },
        select:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'select', config.options);
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            field.onchange = function(){
                proto._valSchema[config.id] = this.value;
                $(proto).trigger('change', [config.id, this.value]);
            }
            this.node = holder;
            this.setValue = function(value){
                field.value = value;
                proto._valSchema[config.id] = value
            };
            this.id = config.id;
        },
        file:function(proto, config){
            if(config.multiple === true){
                config.multiple = 99;
            }
            if(!config.multiple){
                config.multiple = 1;
            }
            var scope = this;
            var createButton = function(imageUrl, i, proto){
                imageUrl = imageUrl || '';
                var el = document.createElement('div');
                el.className = 'upload-button-prop mw-ui-box mw-ui-box-content';
                var btn =  document.createElement('span');
                btn.className = ('mw-ui-btn');
                btn.innerHTML = ('<span class="mw-icon-upload"></span>');
                btn.style.backgroundSize = 'cover';
                btn.style.backgroundColor = 'transparent';
                el.style.backgroundSize = 'cover';
                btn._value = imageUrl;
                btn._index = i;
                if(imageUrl){
                    el.style.backgroundImage = 'url(' + imageUrl + ')';
                }
                btn.onclick = function(){
                    mw.fileWindow({
                        types:'images',
                        change:function(url){
                            url = url.toString();
                            proto._valSchema[config.id] = proto._valSchema[config.id] || [];
                            proto._valSchema[config.id][btn._index] = url;
                            el.style.backgroundImage = 'url(' + url + ')';
                            btn._value = url;
                            scope.refactor();
                        }
                    });
                };
                var close = document.createElement('span');
                close.className = 'mw-badge mw-badge-important';
                close.innerHTML = '<span class="mw-icon-close"></span>';

                close.onclick = function(e){
                    scope.remove(el);
                    e.preventDefault();
                    e.stopPropagation();
                };
                el.appendChild(close);
                el.appendChild(btn);
                return el;
            };

            this.remove = function (i) {
                if(typeof i === 'number'){
                    $('.upload-button-prop', el).eq(i).remove();
                }
                else{
                    $(i).remove();
                }
                scope.refactor();
            };

            this.addImageButton = function(){
                if(config.multiple){
                    this.addBtn = document.createElement('div');
                    this.addBtn.className = 'mw-ui-link';
                    //this.addBtn.innerHTML = '<span class="mw-icon-plus"></span>';
                    this.addBtn.innerHTML = mw.msg.addImage;
                    this.addBtn.onclick = function(){
                        el.appendChild(createButton(undefined, 0, proto));
                        scope.manageAddImageButton();
                    };
                    holder.appendChild(this.addBtn);
                }
            };

            this.manageAddImageButton = function(){
                var isVisible = $('.upload-button-prop', this.node).length < config.multiple;
                this.addBtn.style.display = isVisible ? 'inline-block' : 'none';
            };

            var btn = createButton(undefined, 0, proto);
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            var el = document.createElement('div');
            el.className = 'mw-ui-box-content';
            el.appendChild(btn);
            holder.appendChild(el);


            this.addImageButton();
            this.manageAddImageButton();

            $(el).sortable({
                update:function(){
                    scope.refactor();
                }
            });

            this.refactor = function () {
                var val = [];
                $('.mw-ui-btn', el).each(function(){
                    val.push(this._value);
                });
                this.manageAddImageButton();
                if(val.length === 0){
                    val = [''];
                }
                proto._valSchema[config.id] = val;
                $(proto).trigger('change', [config.id, proto._valSchema[config.id]]);
            };

            this.node = holder;
            this.setValue = function(value){
                value = value || [''];
                proto._valSchema[config.id] = value;
                $('.upload-button-prop', holder).remove();
                $.each(value, function (index) {
                    el.appendChild(createButton(this, index, proto));
                });
                this.manageAddImageButton();
            };
            this.id = config.id;
        },
        icon:function(proto, config){
            var holder = mw.propEditor.helpers.wrapper();

            var selector = mw.iconSelector.iconDropdown(holder, {
                onchange: function (ic) {
                    proto._valSchema[config.id] = ic;
                    $(proto).trigger('change', [config.id, ic]);
                },
                mode: 'relative',
                value: ''
            });
            var label = mw.propEditor.helpers.label(config.label);

            setTimeout(function(){
                $(holder).prepend(label);
            }, 10)

            this.node = holder;
            this.setValue = function(value){
                selector.value(value);
                proto._valSchema[config.id] = value;
            };
            this.id = config.id;

        },
        richtext:function(proto, config){
            var field = mw.propEditor.helpers.field('', 'textarea');
            var holder = mw.propEditor.helpers.wrapper();
            var label = mw.propEditor.helpers.label(config.label);
            holder.appendChild(label);
            holder.appendChild(field);
            $(field).on('change', function(){
                proto._valSchema[config.id] = this.value;
                $(proto).trigger('change', [config.id, this.value]);
            });

            this.node = holder;
            this.setValue = function(value){
                field.value = value;
                if(this.editor.api){
                    $(this.editor).contents().find('#editor-area').html(value);
                }
                else{
                    var scope = this;
                    setTimeout(function(){ scope.setValue(value); }, 300);
                }
                proto._valSchema[config.id] = value;
            };
            this.id = config.id;

            this.editor = mw.editor({
                element:field,
                height:220,
                width:'100%',
                addControls: false,
                hideControls:false
            });
        }
    }
};
