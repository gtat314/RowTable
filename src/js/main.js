var DragContext = {
    'draggedInstance': null
};

var RowTableIcons = {
    'draggable': "<svg xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='2' clip-rule='evenodd' viewBox='0 0 24 24'><path fill-rule='nonzero' d='M14.75 3a.75.75 0 0 0-.75.75v16.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75zm-4 0a.75.75 0 0 0-.75.75v16.5a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75z'/></svg>",
    'more': "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 -960 960 960'><path d='M480-160q-33 0-56.5-23.5T400-240t23.5-56.5T480-320t56.5 23.5T560-240t-23.5 56.5T480-160m0-240q-33 0-56.5-23.5T400-480t23.5-56.5T480-560t56.5 23.5T560-480t-23.5 56.5T480-400m0-240q-33 0-56.5-23.5T400-720t23.5-56.5T480-800t56.5 23.5T560-720t-23.5 56.5T480-640'/></svg>"
};

function debounce ( func, wait ) {
    
    var timeout;

    return function debouncedFunction () {
        
        var context = this;
        var args = arguments;

        clearTimeout( timeout );

        timeout = setTimeout( function () {

            func.apply( context, args );

        }, wait );

    };

}




/**
 * schema: {
 *      parent: Element
 *      classes: array [optional],
 *      disabled: bool [optional],
 *      onClick: Callback [optional],
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
 *                  onClick: Callback [optional]
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
 * @param {'info'|'icon'|'big'|'image'|'linebreaker'|'placeholder'|'controls'|'icons'|'more'} schema.elements[].type
 * @param {Array}                                                                       [schema.elements[].classes]
 * @param {HTMLElement}                                                                 [schema.elements[].title]
 * @param {HTMLElement}                                                                 [schema.elements[].subtitle]
 * @param {SVGElement}                                                                  [schema.elements[].icon]
 * @param {'large'}                                                                     [schema.elements[].size]
 * @param {URL}                                                                         [schema.elements[].src]
 * @param {'eager'|'lazy'}                                                              [schema.elements[].loading]
 * @param {URL}                                                                         [schema.elements[].backgroundImage]
 * @param {Object[]}                                                                    [schema.elements[].buttons]
 * @param {HTMLElement}                                                                 [schema.elements[].buttons[].title]
 * @param {HTMLElement}                                                                 [schema.elements[].buttons[].subtitle]
 * @param {SVGElement}                                                                  [schema.elements[].buttons[].icon]
 * @param {String}                                                                      [schema.elements[].buttons[].prompt]
 * @param {Object}                                                                      [schema.elements[].buttons[].dataAttrs]
 * @param {CallableFunction}                                                            [schema.elements[].buttons[].onClick]
 * @param {Array}                                                                       [schema.classes]
 * @param {Boolean}                                                                     [schema.disabled]
 * @param {Object}                                                                      [schema.dataAttrs]
 * @param {Object}                                                                      [schema.draggable]
 * @param {SVGElement}                                                                  [schema.icon]
 * @param {Boolean}                                                                     [schema.draggable.state]
 * @param {CallableFunction}                                                            [schema.draggable.onRearrange]
 * @param {CallableFunction}                                                            [schema.onClick]
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

    /**
     * 
     * @property
     * @private
     * @type {SVGElement}
     */
    this._draggableIcon = RowTableIcons[ 'draggable' ];

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleDragstartContainer = this._evt_dragstart_container.bind( this );

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleDragleaveContainer = this._evt_dragleave_container.bind( this );

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleDragoverContainer = this._evt_dragover_container.bind( this );

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleDragendContainer = this._evt_dragend_container.bind( this );

    /**
     * @property
     * @private
     * @type {CallableFunction}
     */
    this._handleClickMore = this._evt_click_more.bind( this );




    this._debouncedDragEnterHandler = debounce( this._evt_dragenter_container.bind( this ), 30 );

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

            if ( this._schema.draggable.hasOwnProperty( 'icon' ) ) {

                this._draggableIcon = this._schema.draggable.icon;

            }

            this.containerElem.setAttribute( 'draggable', 'true' );

            const dragElem = document.createElement( 'SPAN' );
            dragElem.classList.add( 'drag' );
            dragElem.innerHTML = this._draggableIcon;
            this.containerElem.appendChild( dragElem );

            this.containerElem.addEventListener( 'dragstart', this._handleDragstartContainer );
            this.containerElem.addEventListener( 'dragenter', this._debouncedDragEnterHandler );
            this.containerElem.addEventListener( 'dragleave', this._handleDragleaveContainer );
            this.containerElem.addEventListener( 'dragover', this._handleDragoverContainer );
            this.containerElem.addEventListener( 'dragend', this._handleDragendContainer );

            if ( this._schema.draggable.hasOwnProperty( 'onRearrange' ) ) {

                this._callbackOnRearrange = this._schema.draggable.onRearrange;

            }

        }

    }

    if ( this._schema.hasOwnProperty( 'dataAttrs' ) ) {

        for ( const attr in this._schema.dataAttrs ) {

            this.containerElem.setAttribute( 'data-' + attr, this._schema.dataAttrs[ attr ] );

        }

    }

    if ( this._schema.hasOwnProperty( 'disabled' ) ) {

        if ( this._schema.disabled === true ) {

            this.containerElem.classList.add( 'disabled' );

        }

    }

    for ( const elem of this._schema.elements ) {

        if ( elem === null ) {

            continue;

        }

        if ( elem.type === 'info' ) {

            const infoElem = document.createElement( 'DIV' );
            infoElem.classList.add( 'info' );
            this.containerElem.appendChild( infoElem );

            if ( elem.hasOwnProperty( 'hover' ) ) {

                infoElem.setAttribute( 'title', elem.hover );

            }

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    infoElem.classList.add( value );
    
                });

            }

            if ( elem.hasOwnProperty( 'title' ) === true ) {

                const infoPElem = document.createElement( 'P' );
                infoPElem.innerHTML = elem.title;
                infoElem.appendChild( infoPElem );

            }

            if ( elem.hasOwnProperty( 'subtitle' ) === true ) {

                const infoSpanElem = document.createElement( 'SPAN' );
                infoSpanElem.innerHTML = elem.subtitle;
                infoElem.appendChild( infoSpanElem );

            }

        } else if ( elem.type === 'icon' ) {

            const controlsElem = document.createElement( 'DIV' );
            controlsElem.classList.add( 'controlsPlain' );
            this.containerElem.appendChild( controlsElem );

            if ( elem.hasOwnProperty( 'hover' ) ) {

                controlsElem.setAttribute( 'title', elem.hover );

            }

            const controlsSampElem = document.createElement( 'SAMP' );
            controlsSampElem.classList.add( 'icon' );
            controlsSampElem.innerHTML = elem.icon;
            controlsElem.appendChild( controlsSampElem );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    controlsElem.classList.add( value );
    
                });

            }

            if ( elem.hasOwnProperty( 'size' ) ) {

                controlsSampElem.classList.add( elem.size );

            }

        } else if ( elem.type === 'icons' ) {

            const iconsElem = document.createElement( 'DIV' );
            iconsElem.classList.add( 'icons' );
            this.containerElem.appendChild( iconsElem );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    iconsElem.classList.add( value );
    
                });

            }

            for ( const button of elem.buttons ) {

                const iconElem = document.createElement( 'SAMP' );
                iconElem.innerHTML = button.icon;
                iconElem.classList.add( 'icon' );

                if ( button.hasOwnProperty( 'classes' ) ) {

                    button.classes.forEach( function( value ){

                        iconElem.classList.add( value );
        
                    });

                }

                if ( button.hasOwnProperty( 'title' ) ) {

                    iconElem.setAttribute( 'title', button.title );

                }

                iconsElem.appendChild( iconElem );

            }

        } else if ( elem.type === 'big' ) {

            const bigElemWrap = document.createElement( 'DIV' );
            bigElemWrap.classList.add( 'big' );
            this.containerElem.appendChild( bigElemWrap );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    bigElemWrap.classList.add( value );
    
                });

            }

            if ( elem.hasOwnProperty( 'title' ) === true ) {

                var bigElem = document.createElement( 'SAMP' );
                bigElem.innerHTML = elem.title;
                bigElemWrap.appendChild( bigElem );

            }

        } else if ( elem.type === 'image' ) {

            const imageHolderElem = document.createElement( 'DIV' );
            imageHolderElem.classList.add( 'image' );
            this.containerElem.appendChild( imageHolderElem );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    imageHolderElem.classList.add( value );
    
                });

            }

            if ( elem.hasOwnProperty( 'src' ) ) {

                if ( elem.src !== null ) {

                    const imgElem = document.createElement( 'IMG' );
                    imgElem.src = elem.src;
                    imageHolderElem.appendChild( imgElem );

                    if ( elem.hasOwnProperty( 'loading' ) ) {

                        imgElem.setAttribute( 'loading', elem.loading );

                    }

                } else {

                    if ( elem.hasOwnProperty( 'backgroundImage' ) ) {

                        imageHolderElem.innerHTML = elem.backgroundImage;

                    }

                }

            }

        } else if ( elem.type === 'more' ) {

            const moreElem = document.createElement( 'DIV' );
            moreElem.classList.add( 'more' );
            this.containerElem.appendChild( moreElem );

            const moreButtonElem = document.createElement( 'DIV' );
            moreButtonElem.classList.add( 'button' );
            moreElem.appendChild( moreButtonElem );

            if ( elem.hasOwnProperty( 'icon' ) ) {

                moreButtonElem.innerHTML = elem.icon;

            } else {

                moreButtonElem.innerHTML = RowTableIcons.more;

            }

            moreButtonElem.addEventListener( 'click', this._handleClickMore );

            const moreMenuElem = document.createElement( 'DIV' );
            moreMenuElem.classList.add( 'menu' );
            moreElem.appendChild( moreMenuElem );

            for ( const button of elem.buttons ) {

                const moreButtonElemP = document.createElement( 'P' );
                moreMenuElem.appendChild( moreButtonElemP );

                const moreButtonTitleElem = document.createElement( 'SPAN' );
                moreButtonTitleElem.textContent = button.title;
                moreButtonElemP.appendChild( moreButtonTitleElem );

                if ( button.hasOwnProperty( 'subtitle' ) ) {

                    const moreButtonSubtitleElem = document.createElement( 'SAMP' );
                    moreButtonSubtitleElem.textContent = button.subtitle;
                    moreButtonElemP.appendChild( moreButtonSubtitleElem );

                }

                if ( button.hasOwnProperty( 'dataAttrs' ) ) {

                    for ( const attr in button.dataAttrs ) {
        
                        moreButtonElemP.setAttribute( 'data-' + attr, button.dataAttrs[ attr ] );
        
                    }
        
                }

                if ( button.hasOwnProperty( 'onClick' ) === true ) {

                    moreButtonElemP.addEventListener( 'click', function( evt ) {

                        evt.stopPropagation();
                        
                        var menuContainer = evt.currentTarget.closest( '.more' );

                        if ( menuContainer ) {

                            menuContainer.classList.remove( 'active' );

                        }

                        button.onClick.call( this, evt );

                    });

                }

                const hrElem = document.createElement( 'HR' );
                moreMenuElem.appendChild( hrElem );

            }

        } else if ( elem.type === 'controls' ) {

            const controlsElem = document.createElement( 'DIV' );
            controlsElem.classList.add( 'controls' );
            this.containerElem.appendChild( controlsElem );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    controlsElem.classList.add( value );
    
                });

            }

            for ( const button of elem.buttons ) {

                const controlsButtonElem = document.createElement( 'SAMP' );
                controlsButtonElem.classList.add( 'icon' );
                controlsButtonElem.innerHTML = button.icon;

                if ( button.hasOwnProperty( 'classes' ) ) {

                    button.classes.forEach( function( value ){

                        controlsButtonElem.classList.add( value );
        
                    });

                }

                if ( button.hasOwnProperty( 'title' ) ) {

                    const controlsButtonTitleElem = document.createElement( 'SPAN' );
                    controlsButtonTitleElem.innerHTML = button.title;
                    controlsButtonElem.appendChild( controlsButtonTitleElem );

                }

                if ( button.hasOwnProperty( 'prompt' ) ) {

                    controlsButtonElem.setAttribute( 'title', button.prompt );

                }

                if ( button.hasOwnProperty( 'dataAttrs' ) ) {

                    for ( const attr in button.dataAttrs ) {
        
                        controlsButtonElem.setAttribute( 'data-' + attr, button.dataAttrs[ attr ] );
        
                    }
        
                }

                if ( button.hasOwnProperty( 'onClick' ) === true ) {

                    controlsButtonElem.addEventListener( 'click', button.onClick );

                }

                controlsElem.appendChild( controlsButtonElem );

            }

        } else if ( elem.type === 'linebreaker' ) {

            const linebreakerElem = document.createElement( 'DIV' );
            linebreakerElem.classList.add( 'linebreaker' );
            this.containerElem.appendChild( linebreakerElem );

            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    linebreakerElem.classList.add( value );
    
                });

            }

        } else if ( elem.type === 'placeholder' ) {

            this.placeholderContainer = document.createElement( 'DIV' );
            
            if ( elem.hasOwnProperty( 'classes' ) ) {

                elem.classes.forEach( function( value ){

                    this.placeholderContainer.classList.add( value );
    
                }.bind( this ));

            }

            this.containerElem.appendChild( this.placeholderContainer );

        }

    }

    if ( this._schema.hasOwnProperty( 'onClick' ) === true ) {

        this.containerElem.addEventListener( 'click', this._schema.onClick );

    }

    parentElem.appendChild( this.containerElem );

};




/**
 * 
 * @returns {void}
 */
RowTable.prototype.destroy = function() {
    
    // 1. Guard clause: Check if already destroyed to prevent errors
    if ( !this.containerElem ) {

        return;

    }

    // 2. Unbind Drag & Drop Listeners
    // We only need to unbind these if they were actually attached
    if ( this._schema && this._schema.draggable && this._schema.draggable.state === true ) {
        
        this.containerElem.removeEventListener( 'dragstart', this._handleDragstartContainer );
        this.containerElem.removeEventListener( 'dragenter', this._debouncedDragEnterHandler );
        this.containerElem.removeEventListener( 'dragleave', this._handleDragleaveContainer );
        this.containerElem.removeEventListener( 'dragover', this._handleDragoverContainer );
        this.containerElem.removeEventListener( 'dragend', this._handleDragendContainer );
        
    }

    // 3. Unbind the primary click listener
    if ( this._schema && typeof this._schema.onClick === 'function' ) {

        this.containerElem.removeEventListener( 'click', this._schema.onClick );

    }

    // 4. Remove the element from the DOM
    if ( this.containerElem.parentElement ) {

        this.containerElem.parentElement.removeChild( this.containerElem );
        
    }

    // 5. Nullify DOM references so the Garbage Collector can delete them
    this.containerElem = null;
    this.placeholderContainer = null;

    // 6. Nullify data and callback references
    this._schema = null;
    this._callbackOnRearrange = null;
    
    // 7. Nullify the bound function properties
    this._handleDragstartContainer = null;
    this._handleDragleaveContainer = null;
    this._handleDragoverContainer = null;
    this._handleDragendContainer = null;
    this._debouncedDragEnterHandler = null;

};




/**
 * @method
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_click_more = function( evt ) {

    evt.stopPropagation();

    const parent                = evt.currentTarget.parentElement;
    const isCurrentlyActive     = parent.classList.contains( 'active' );
    const elems                 = document.querySelectorAll( 'table-row .more' );

    for ( const elem of elems ) {

        elem.classList.remove( 'active' );
        elem.classList.remove( 'flip-up' );

    }

    if ( !isCurrentlyActive ) {

        // 2. We must make the menu active FIRST so the browser gives it a physical height
        parent.classList.add( 'active' );

        // 3. Find the specific menu inside this parent that we just revealed
        const menuElement = parent.querySelector( '.menu' );

        // 4. Measure the space below the button and the actual height of the menu
        const buttonRect = evt.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - buttonRect.bottom;
        
        // offsetHeight gets the exact rendered height in pixels, including padding and borders
        const menuHeight = menuElement.offsetHeight;

        // 5. If the exact height of the menu is larger than the space left on screen, flip it
        if ( spaceBelow < menuHeight ) {
            
            parent.classList.add( 'flip-up' );

        }

    }

};

/**
 * 
 * @private
 * @param {Event} evt 
 */
RowTable.prototype._evt_dragstart_container = function( evt ) {

    DragContext.draggedInstance = this;

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

    DragContext.draggedInstance = null;

    var placeholder = this.containerElem.parentElement.querySelector( '.dragPlaceHolder' );

    if ( placeholder ) {

        placeholder.parentElement.insertBefore( this.containerElem, placeholder );
        placeholder.remove();

        if ( typeof this._callbackOnRearrange === 'function' ) {

            this._callbackOnRearrange( this.containerElem );

        }

    }

};




document.addEventListener( 'click', function( evt ) {

    // 1. Find out if any menus are currently open
    var activeMenus = document.querySelectorAll( 'table-row .more.active' );
    
    // If no menus are open, do nothing and let the click happen normally
    if ( activeMenus.length === 0 ) {

        return;

    }

    // 2. Check if the user clicked INSIDE the active menu itself
    var clickedInsideMenu = evt.target.closest( 'table-row .more.active' );

    // 3. If they clicked outside the menu...
    if ( !clickedInsideMenu ) {
        
        // Close the menus
        for ( const activeMenu of activeMenus ) {

            activeMenu.classList.remove( 'active' );

        }

        // STOP the event dead in its tracks. 
        // It will never reach the element the user actually clicked.
        evt.stopPropagation();
        evt.preventDefault();
    }

}, true );