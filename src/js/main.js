/**
 * 
 * @employSchema
 * @eventListeners
 * @sensibleDefaults
 * @svgSrc
 * @documentation
 * @documentationApi
 * @iconUniformNames
 * @minimizeProperties
 * @objectifyEventListeners
 * @parentElementSelector
 * @distinctEventListeners
 * @propertiesElemUnderscore
 * @propertify
 * @methodNamingConventions
 * @propertyNamingConventions
 */




/**
 * schema: {
 *      parent: Element
 *      classes: array [optional],
 *      disabled: bool [optional],
 *      onClick: Callback [optional],
 *      eventListeners: Array [optiona] [
 *          {
 *              type: EventType,
 *              listener: Callback
 *          }
 *      ],
 *      dataAttrs: object [optional] {
 *          attributeName: attributeValue
 *      },
 *      draggable: object [optional] {
 *          state: bool,
 *          onRearrange: callback [optional]
 *      },
 *      elements: array [
 *          {
 *              type: 'info',
 *              classes: array [optional],
 *              title: html [optional],
 *              subtitle: html [optional]
 *          },
 *          {
 *              type: 'icon',
 *              size: 'large' [optional]
 *          },
 *          {
 *              type: 'big',
 *              classes: array [optional],
 *              title: html [optional]
 *          },
 *          {
 *              type: 'image',
 *              classes: array [optional],
 *              src: imageUrl [optional],
 *              loading: 'eager'|'lazy',
 *              backgroundImage: imageUrl
 *          },
 *          {
 *              type: 'linebreaker',
 *              classes: array [optional]
 *          },
 *          {
 *              type: 'placeholder',
 *              classes: array [optional]
 *          },
 *          {
 *              type: 'controls',
 *              classes: array [optional],
 *              buttons: array {
 *                  icon: svgHtml,
 *                  prompt: text [optional],
 *                  dataAttrs: object [optional] {
 *                      attributeName: attributeValue
 *                  },
 *                  onClick: Callback [optional],
 *                  eventListeners: Array [optiona] [
 *                      {
 *                          type: EventType,
 *                          listener: Callback
 *                      }
 *                  ]
 *              }
 *          }
 *      ]
 * }
 */




/**
 * 
 * @param {Object}                                                                       schema
 * @param {HTMLElement|CSSRule}                                                          schema.parent
 * @param {String}                                                                       schema.title
 * @param {Object[]}                                                                     schema.elements
 * @param {'info'|'icon'|'big'|'image'|'linebreaker'|'placeholder'|'controls'|'icons'}   schema.elements[].type
 * @param {Array}                                                                       [schema.elements[].classes]
 * @param {HTMLSourceElement}                                                           [schema.elements[].title]
 * @param {HTMLSourceElement}                                                           [schema.elements[].subtitle]
 * @param {'large'}                                                                     [schema.elements[].size]
 * @param {URL}                                                                         [schema.elements[].src]
 * @param {'eager'|'lazy'}                                                              [schema.elements[].loading]
 * @param {URL}                                                                         [schema.elements[].backgroundImage]
 * @param {Object[]}                                                                    [schema.elements[].buttons]
 * @param {HTMLSourceElement}                                                           [schema.elements[].buttons[].title]
 * @param {SVGElement}                                                                  [schema.elements[].buttons[].icon]
 * @param {String}                                                                      [schema.elements[].buttons[].prompt]
 * @param {Object}                                                                      [schema.elements[].buttons[].dataAttrs]
 * @param {Object[]}                                                                    [schema.elements[].buttons[].eventListeners]
 * @param {String}                                                                      [schema.elements[].buttons[].eventListeners[].type]
 * @param {Function}                                                                    [schema.elements[].buttons[].eventListeners[].listener]
 * @param {Function}                                                                    [schema.elements[].buttons[].onClick]
 * @param {Array}                                                                       [schema.classes]
 * @param {Boolean}                                                                     [schema.disabled]
 * @param {Object}                                                                      [schema.dataAttrs]
 * @param {Object}                                                                      [schema.draggable]
 * @param {Boolean}                                                                     [schema.draggable.state]
 * @param {Function}                                                                    [schema.draggable.onRearrange]
 * @param {Function}                                                                    [schema.onClick]
 * @param {Object[]}                                                                    [schema.eventListeners]
 * @param {String}                                                                       schema.eventListeners[].type
 * @param {Function}                                                                     schema.eventListeners[].listener
 * 
 * @member {HTMLElement}                                                                 containerElem
 * @member {HTMLElement|null}                                                            placeholderContainer
 */
function RowTable( schema ) {

    /**
     * 
     * @property
     * @private
     */
    this._schema = schema;

    /**
     * 
     * @private
     */
    this.containerElem = null;

    /**
     * 
     * @property
     */
    this.placeholderContainer = null;

    /**
     * 
     * @property
     * @private
     */
    this._callbackOnRearrange = null;




    var fragment = document.createDocumentFragment();
    var parentElem;

    if ( typeof this._schema.parent === 'object' ) {

        parentElem = this._schema.parent;

    } else if ( typeof this._schema.parent === 'string' ) {

        parentElem = document.querySelector( this._schema.parent );

    }

    this.containerElem = document.createElement( 'table-row' );

    if ( this._schema.hasOwnProperty( 'classes' ) ) {

        this._schema.classes.forEach( function( value ){

            this.containerElem.classList.add( value );

        }.bind( this ));

    }

    if ( this._schema.hasOwnProperty( 'title' ) ) {

        this.containerElem.setAttribute( 'title', this._schema.title );

    }

    if ( this._schema.hasOwnProperty( 'draggable' ) ) {

        if ( this._schema.draggable.state === true ) {

            this.containerElem.setAttribute( 'draggable', 'true' );

            var dragElem = document.createElement( 'SPAN' );
            dragElem.classList.add( 'drag' );
            dragElem.innerHTML = "<svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 24 24'><path fill-rule='nonzero' d='M14.75 3a.75.75 0 0 0-.75.75v16.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75zm-4 0a.75.75 0 0 0-.75.75v16.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75z'/></svg>";
            this.containerElem.appendChild( dragElem );

            this.containerElem.addEventListener( 'dragstart', this._evt_dragstart_container.bind( this ) );
            this.containerElem.addEventListener( 'dragenter', this._evt_dragenter_container.bind( this ) );
            this.containerElem.addEventListener( 'dragleave', this._evt_dragleave_container.bind( this ) );
            this.containerElem.addEventListener( 'dragover', this._evt_dragover_container.bind( this ) );
            this.containerElem.addEventListener( 'dragend', this._evt_dragend_container.bind( this ) );

            if ( this._schema.draggable.hasOwnProperty( 'onRearrange' ) ) {

                this._callbackOnRearrange = this._schema.draggable.onRearrange;

            }

        }

    }

    if ( this._schema.hasOwnProperty( 'dataAttrs' ) ) {

        for ( var attr in this._schema.dataAttrs ) {

            this.containerElem.setAttribute( 'data-' + attr, this._schema.dataAttrs[ attr ] );

        }

    }

    if ( this._schema.hasOwnProperty( 'disabled' ) ) {

        if ( this._schema.disabled === true ) {

            this.containerElem.classList.add( 'disabled' );

        }

    }

    fragment.appendChild( this.containerElem );

    for ( var i = 0 ; i < this._schema.elements.length ; i++ ) {

        if ( this._schema.elements[ i ] === null ) {

            continue;

        }

        if ( this._schema.elements[ i ].type === 'info' ) {

            var infoElem = document.createElement( 'DIV' );
            infoElem.classList.add( 'info' );
            this.containerElem.appendChild( infoElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'hover' ) ) {

                infoElem.setAttribute( 'title', this._schema.elements[ i ].hover );

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    infoElem.classList.add( value );
    
                });

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'title' ) === true ) {

                var infoPElem = document.createElement( 'P' );
                infoPElem.innerHTML = this._schema.elements[ i ].title;
                infoElem.appendChild( infoPElem );

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'subtitle' ) === true ) {

                var infoSpanElem = document.createElement( 'SPAN' );
                infoSpanElem.innerHTML = this._schema.elements[ i ].subtitle;
                infoElem.appendChild( infoSpanElem );

            }

        } else if ( this._schema.elements[ i ].type === 'icon' ) {

            var controlsElem = document.createElement( 'DIV' );
            controlsElem.classList.add( 'controlsPlain' );
            this.containerElem.appendChild( controlsElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'hover' ) ) {

                controlsElem.setAttribute( 'title', this._schema.elements[ i ].hover );

            }

            var controlsSampElem = document.createElement( 'SAMP' );
            controlsSampElem.classList.add( 'icon' );
            controlsSampElem.innerHTML = this._schema.elements[ i ].icon;
            controlsElem.appendChild( controlsSampElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    controlsElem.classList.add( value );
    
                });

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'size' ) ) {

                controlsSampElem.classList.add( this._schema.elements[ i ].size );

            }

        } else if ( this._schema.elements[ i ].type === 'icons' ) {

            var iconsElem = document.createElement( 'DIV' );
            iconsElem.classList.add( 'icons' );
            this.containerElem.appendChild( iconsElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    iconsElem.classList.add( value );
    
                });

            }

            for ( var a = 0 ; a < this._schema.elements[ i ].buttons.length ; a++ ) {

                var iconElem = document.createElement( 'SAMP' );
                iconElem.innerHTML = this._schema.elements[ i ].buttons[ a ].icon;
                iconElem.classList.add( 'icon' );

                if ( this._schema.elements[ i ].buttons[ a ].hasOwnProperty( 'classes' ) ) {

                    this._schema.elements[ i ].buttons[ a ].classes.forEach( function( value ){

                        iconElem.classList.add( value );
        
                    });

                }

                if ( this._schema.elements[ i ].buttons[ a ].hasOwnProperty( 'title' ) ) {

                    iconElem.setAttribute( 'title', this._schema.elements[ i ].buttons[ a ].title );

                }

                iconsElem.appendChild( iconElem );

            }

        } else if ( this._schema.elements[ i ].type === 'big' ) {

            var bigElemWrap = document.createElement( 'DIV' );
            bigElemWrap.classList.add( 'big' );
            this.containerElem.appendChild( bigElemWrap );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    bigElemWrap.classList.add( value );
    
                });

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'title' ) === true ) {

                var bigElem = document.createElement( 'SAMP' );
                bigElem.innerHTML = this._schema.elements[ i ].title;
                bigElemWrap.appendChild( bigElem );

            }

        } else if ( this._schema.elements[ i ].type === 'image' ) {

            var imageHolderElem = document.createElement( 'DIV' );
            imageHolderElem.classList.add( 'image' );
            this.containerElem.appendChild( imageHolderElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    imageHolderElem.classList.add( value );
    
                });

            }

            if ( this._schema.elements[ i ].hasOwnProperty( 'src' ) ) {

                if ( this._schema.elements[ i ].src !== null ) {

                    var imgElem = document.createElement( 'IMG' );
                    imgElem.src = this._schema.elements[ i ].src;
                    imageHolderElem.appendChild( imgElem );

                    if ( this._schema.elements[ i ].hasOwnProperty( 'loading' ) ) {

                        imgElem.setAttribute( 'loading', this._schema.elements[ i ].loading );

                    }

                } else {

                    if ( this._schema.elements[ i ].hasOwnProperty( 'backgroundImage' ) ) {

                        imageHolderElem.innerHTML = this._schema.elements[ i ].backgroundImage;

                    }

                }

            }

        } else if ( this._schema.elements[ i ].type === 'controls' ) {

            var controlsElem = document.createElement( 'DIV' );
            controlsElem.classList.add( 'controls' );
            this.containerElem.appendChild( controlsElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    controlsElem.classList.add( value );
    
                });

            }

            for ( var p = 0 ; p < this._schema.elements[ i ].buttons.length ; p++ ) {

                var controlsButtonElem = document.createElement( 'SAMP' );
                controlsButtonElem.classList.add( 'icon' );
                controlsButtonElem.innerHTML = this._schema.elements[ i ].buttons[ p ].icon;

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'classes' ) ) {

                    this._schema.elements[ i ].buttons[ p ].classes.forEach( function( value ){

                        controlsButtonElem.classList.add( value );
        
                    });

                }

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'title' ) ) {

                    var controlsButtonTitleElem = document.createElement( 'SPAN' );
                    controlsButtonTitleElem.innerHTML = this._schema.elements[ i ].buttons[ p ].title;
                    controlsButtonElem.appendChild( controlsButtonTitleElem );

                }

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'prompt' ) ) {

                    controlsButtonElem.setAttribute( 'title', this._schema.elements[ i ].buttons[ p ].prompt );

                }

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'dataAttrs' ) ) {

                    for ( var attr in this._schema.elements[ i ].buttons[ p ].dataAttrs ) {
        
                        controlsButtonElem.setAttribute( 'data-' + attr, this._schema.elements[ i ].buttons[ p ].dataAttrs[ attr ] );
        
                    }
        
                }

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'eventListeners' ) === true ) {

                    for ( var s = 0 ; s < this._schema.elements[ i ].buttons[ p ].eventListeners.length ; s++ ) {

                        controlsButtonElem.addEventListener(
                            this._schema.elements[ i ].buttons[ p ].eventListeners[ s ].type,
                            this._schema.elements[ i ].buttons[ p ].eventListeners[ s ].listener
                        );
        
                    }
        
                }

                if ( this._schema.elements[ i ].buttons[ p ].hasOwnProperty( 'onClick' ) === true ) {

                    controlsButtonElem.addEventListener( 'click', this._schema.elements[ i ].buttons[ p ].onClick );

                }

                controlsElem.appendChild( controlsButtonElem );

            }

        } else if ( this._schema.elements[ i ].type === 'linebreaker' ) {

            var linebreakerElem = document.createElement( 'DIV' );
            linebreakerElem.classList.add( 'linebreaker' );
            this.containerElem.appendChild( linebreakerElem );

            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    linebreakerElem.classList.add( value );
    
                });

            }

        } else if ( this._schema.elements[ i ].type === 'placeholder' ) {

            this.placeholderContainer = document.createElement( 'DIV' );
            
            if ( this._schema.elements[ i ].hasOwnProperty( 'classes' ) ) {

                this._schema.elements[ i ].classes.forEach( function( value ){

                    this.placeholderContainer.classList.add( value );
    
                }.bind( this ));

            }

            this.containerElem.appendChild( this.placeholderContainer );

        }

    }

    if ( this._schema.hasOwnProperty( 'eventListeners' ) === true ) {

        for ( var a = 0 ; a < this._schema.eventListeners.length ; a++ ) {

            this.containerElem.addEventListener(
                this._schema.eventListeners[ a ].type,
                this._schema.eventListeners[ a ].listener
            );

        }

    }

    if ( this._schema.hasOwnProperty( 'onClick' ) === true ) {

        this.containerElem.addEventListener( 'click', this._schema.onClick );

    }

    parentElem.appendChild( fragment );

};




/**
 * 
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragstart_container = function( evt ) {

    evt.dataTransfer.setData( 'text', JSON.stringify( this._schema.dataAttrs ) );
    
    for ( var attr in this._schema.dataAttrs ) {

        this.containerElem.removeAttribute( 'data-' + attr, this._schema.dataAttrs[ attr ] );

    }

};

/**
 * 
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragenter_container = function( evt ) {

    evt.preventDefault();

    if ( this.containerElem.parentElement.querySelector( '.dragPlaceHolder' ) ) {

        this.containerElem.parentElement.removeChild( this.containerElem.parentElement.querySelector( '.dragPlaceHolder' ) );

    }

    var dragPlaceHolder = document.createElement( 'DIV' );
    dragPlaceHolder.classList.add( 'dragPlaceHolder' );
    dragPlaceHolder.style.height = this.containerElem.offsetHeight + 'px';

    this.containerElem.parentElement.insertBefore( dragPlaceHolder, this.containerElem );

};

/**
 * 
 * @method
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragleave_container = function( evt ) {

    evt.preventDefault();

};

/**
 * 
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragover_container = function( evt ) {

    evt.preventDefault();

};

/**
 * 
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragend_container = function( evt ) {

    evt.preventDefault();

    var dataAttrs = JSON.parse( evt.dataTransfer.getData( 'text' ) );

    for ( var attr in dataAttrs ) {

        this.containerElem.parentElement.querySelector( '.dragPlaceHolder' ).setAttribute( 'data-' + attr, dataAttrs[ attr ] );

    }

    if ( this._callbackOnRearrange !== null ) {

        this._callbackOnRearrange();

    }

};