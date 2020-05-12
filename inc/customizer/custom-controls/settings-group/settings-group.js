( function( $ ) {
    
    /**
     * JS to manage the sticky heading of an open section on scroll up.
     */
    jQuery( document ).ready(function() {
        var last_scroll_top = 0;
        var parentSection   = jQuery( '.wp-full-overlay-sidebar-content' );
        var browser = navigator.userAgent.toLowerCase();
        if ( ! ( browser.indexOf( 'firefox' ) > -1 ) ) {
        var parent_width_remove = 6;
        } else {
        var parent_width_remove = 16;
        }
        jQuery('#customize-controls .wp-full-overlay-sidebar-content .control-section').on( 'scroll', function (event) {
            var $this = jQuery(this);
            // Run sticky js for only open section.
            if ( $this.hasClass( 'open' ) ) {
                var section_title = $this.find( '.customize-section-title' );
                var scroll_top    = $this.scrollTop();
                if ( scroll_top > last_scroll_top ) {
                    // On scroll down, remove sticky section title.
                    section_title.removeClass( 'maybe-sticky' ).removeClass( 'is-in-view' ).removeClass( 'is-sticky' );
                    $this.css( 'padding-top', '' );
                } else {
                    // On scroll up, add sticky section title.
                    var parent_width = $this.outerWidth();
                    section_title.addClass( 'maybe-sticky' ).addClass( 'is-in-view' ).addClass( 'is-sticky' ).width( parent_width - parent_width_remove ).css( 'top', parentSection.css( 'top' ) );
                    if ( ! ( browser.indexOf( 'firefox' ) > -1 ) ) {
                        $this.css( 'padding-top', section_title.height() );
                    }
                    if( scroll_top === 0 ) {
                        // Remove sticky section heading when scrolled to the top.
                        section_title.removeClass( 'maybe-sticky' ).removeClass( 'is-in-view' ).removeClass( 'is-sticky' );
                        $this.css( 'padding-top', '' );
                    }
                }
                last_scroll_top = scroll_top;
            }
        });
    });

    wp.customize.controlConstructor['ast-settings-group'] = wp.customize.Control.extend({

        ready : function() {

            'use strict';

            var control = this,
            value   = control.setting._value;

            control.registerToggleEvents();
            this.container.on( 'ast_settings_changed', control.onOptionChange );
        },

        registerToggleEvents: function() {

            var control = this;

            /* Close popup when click outside anywhere outside of popup */
            $( '.wp-full-overlay-sidebar-content, .wp-picker-container' ).click( function( e ) {
                if ( ! $( e.target ).closest( '.ast-field-settings-modal' ).length ) {
                    $( '.ast-adv-toggle-icon.open' ).trigger( 'click' );
                }
            });
            
            control.container.on( 'click', '.ast-toggle-desc-wrap .ast-adv-toggle-icon', function( e ) {
                
                e.preventDefault();
                e.stopPropagation();
                
                var $this = jQuery(this);
                
                var parent_wrap = $this.closest( '.customize-control-ast-settings-group' );
                var is_loaded = parent_wrap.find( '.ast-field-settings-modal' ).data('loaded');
                var parent_section = parent_wrap.parents('.control-section');
                
                if( $this.hasClass('open') ) {
                    parent_wrap.find( '.ast-field-settings-modal' ).hide();
                } else {
                    /* Close popup when another popup is clicked to open */
                    var get_open_popup = parent_section.find('.ast-adv-toggle-icon.open');
                    if( get_open_popup.length > 0 ) {
                        get_open_popup.trigger('click');
                    }
                    if( is_loaded ) {
                        parent_wrap.find( '.ast-field-settings-modal' ).show();
                    } else {
                        var fields = control.params.ast_fields;

                        var $modal_wrap = $( astra.customizer.group_modal_tmpl );

                        parent_wrap.find( '.ast-field-settings-wrap' ).append( $modal_wrap );
                        parent_wrap.find( '.ast-fields-wrap' ).attr( 'data-control', control.params.name );
                        control.ast_render_field( parent_wrap, fields, control );

                        parent_wrap.find( '.ast-field-settings-modal' ).show();

                        device = jQuery("#customize-footer-actions .active").attr('data-device');

                        if( 'mobile' == device ) {
                            jQuery('.ast-responsive-btns .mobile, .ast-responsive-slider-btns .mobile').addClass('active');
                            jQuery('.ast-responsive-btns .preview-mobile, .ast-responsive-slider-btns .preview-mobile').addClass('active');
                        } else if( 'tablet' == device ) {
                            jQuery('.ast-responsive-btns .tablet, .ast-responsive-slider-btns .tablet').addClass('active');
                            jQuery('.ast-responsive-btns .preview-tablet, .ast-responsive-slider-btns .preview-tablet').addClass('active');
                        } else {
                            jQuery('.ast-responsive-btns .desktop, .ast-responsive-slider-btns .desktop').addClass('active');
                            jQuery('.ast-responsive-btns .preview-desktop, .ast-responsive-slider-btns .preview-desktop').addClass('active');
                        }
                    }
                }

                $this.toggleClass('open');

                var iframe = jQuery( '#customize-preview' ).find( 'iframe' );
				var preview_head = iframe.contents().find( "head" );
				var preview_body = iframe.contents().find( "body" );

				if( ! preview_body.hasClass('ast-woo-cart-preview-style') ) {
					if( astraCustomizerControlBackground.isSiteRTL ) {
						var output = "<style type='text/css' id='ast-woo-cart-preview-style'> .open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart {left: auto;right: -10px;transition: 0s;opacity: 1;margin-top: 10px;visibility: visible;}.open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart:before {right: 15px;right: auto;}.open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart:after {display: none;} </style>";
					} else {
						var output = "<style type='text/css' id='ast-woo-cart-preview-style'> .open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart {right: auto;left: -10px;transition: 0s;opacity: 1;margin-top: 10px;visibility: visible;}.open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart:before {left: 15px;right: auto;}.open-preview-woocommerce-cart #ast-site-header-cart .widget_shopping_cart:after {display: none;} </style>";
					}

					preview_body.addClass( 'ast-woo-cart-preview-style' );
					preview_head.append( output );
				}

				if( preview_body.hasClass('open-preview-woocommerce-cart') ) {
					preview_body.removeClass( 'open-preview-woocommerce-cart' );
                }

				if( ( 'customize-control-astra-settings-primary-woo-cart-colors' == parent_wrap.attr("id") || 'customize-control-astra-settings-primary-woo-cart-button-colors' == parent_wrap.attr("id") || 'customize-control-astra-settings-primary-woo-checkout-button-colors' == parent_wrap.attr("id") ) && $this.hasClass('open') ) {
					preview_body.addClass( 'open-preview-woocommerce-cart' );
				}
            });

            control.container.on( "click", ".ast-toggle-desc-wrap > .customizer-text", function( e ) {

                e.preventDefault();
                e.stopPropagation();

                jQuery(this).find( '.ast-adv-toggle-icon' ).trigger('click');
            });
        },

        ast_render_field: function( wrap, fields, control_elem ) {

            var control = this;
            var ast_field_wrap = wrap.find( '.ast-fields-wrap' );
            var fields_html = '';
            var control_types = [];
            var field_values = control.isJsonString( control_elem.params.value ) ? JSON.parse( control_elem.params.value ) : {};

            if( 'undefined' != typeof fields.tabs ) {

                var clean_param_name = control_elem.params.name.replace( '[', '-' ),
                    clean_param_name = clean_param_name.replace( ']', '' );

                fields_html += '<div id="' + clean_param_name + '-tabs" class="ast-group-tabs">'; 
                fields_html += '<ul class="ast-group-list">'; 
                var counter = 0;

                _.each( fields.tabs, function ( value, key ) {

                    var li_class = '';
                    if( 0 == counter ) {
                        li_class = "active";
                    }

                    fields_html += '<li class="'+ li_class + '"><a href="#tab-' + key + '"><span>' + key +  '</span></a></li>';
                    counter++;
                });

                fields_html += '</ul>'; 

                fields_html += '<div class="ast-tab-content" >';

                _.each( fields.tabs, function ( fields_data, key ) {

                    fields_html += '<div id="tab-'+ key +'" class="tab">';

                    var result = control.generateFieldHtml( fields_data, field_values );

                    fields_html += result.html;

                    _.each( result.controls , function ( control_value, control_key ) {
                        control_types.push({
                            key: control_value.key,
                            value : control_value.value,
                            name  : control_value.name 
                        });
                    });

                    fields_html += '</div>';
                });

                fields_html += '</div></div>';

                ast_field_wrap.html( fields_html );

                $( "#" + clean_param_name + "-tabs" ).tabs();

            } else {

                var result = control.generateFieldHtml( fields, field_values );

                fields_html += result.html;
                
                _.each( result.controls, function (control_value, control_key) {
                    control_types.push({
                        key: control_value.key,
                        value: control_value.value,
                        name: control_value.name
                    });
                });

                ast_field_wrap.html(fields_html);
            }

            _.each( control_types, function( control_type, index ) {

                switch( control_type.key ) {

                    case "ast-responsive-color":
                        control.initResponsiveColor( ast_field_wrap, control_elem, control_type.name );
                    break;  

                    case "ast-color": 
                        control.initColor( ast_field_wrap, control_elem, control_type.name );
                    break;

                    case "ast-font": 

                        var googleFontsString = astra.customizer.settings.google_fonts;
                        control.container.find( '.ast-font-family' ).html( googleFontsString );

                        control.container.find( '.ast-font-family' ).each( function() {
                            var selectedValue = $(this).data('value');
                            $(this).val( selectedValue );

                            var optionName = $(this).data('name');

                            // Set inherit option text defined in control parameters.
                            $("select[data-name='" + optionName + "'] option[value='inherit']").text( $(this).data('inherit') );

                            var fontWeightContainer = jQuery(".ast-font-weight[data-connected-control='" + optionName + "']");
                            var weightObject = AstTypography._getWeightObject( AstTypography._cleanGoogleFonts( selectedValue ) );

                            control.generateDropdownHtml( weightObject, fontWeightContainer );
                            fontWeightContainer.val( fontWeightContainer.data('value') );

                        }); 

                        control.container.find( '.ast-font-family' ).selectWoo();
                        control.container.find( '.ast-font-family' ).on( 'select2:select', function() {

                            var value = $(this).val();
                            var weightObject = AstTypography._getWeightObject( AstTypography._cleanGoogleFonts( value ) );
                            var optionName = $(this).data( 'name' );
                            var fontWeightContainer = jQuery(".ast-font-weight[data-connected-control='" + optionName + "']");

                            control.generateDropdownHtml( weightObject, fontWeightContainer );

                            var font_control = $(this).parents( '.customize-control' ).attr( 'id' );
                            font_control = font_control.replace( 'customize-control-', '' );

                            control.container.trigger( 'ast_settings_changed', [ control, jQuery(this), value, font_control ] );

                            var font_weight_control = fontWeightContainer.parents( '.customize-control' ).attr( 'id' );
                            font_weight_control = font_weight_control.replace( 'customize-control-', '' );

                            control.container.trigger( 'ast_settings_changed', [ control, fontWeightContainer, fontWeightContainer.val(), font_weight_control ] );
                            
                        });

                        control.container.find( '.ast-font-weight' ).on( 'change', function() {

                            var value = $(this).val();

                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );

                            control.container.trigger( 'ast_settings_changed', [ control, jQuery(this), value, name ] );
                        });
                        
                    break;  

                    case "ast-responsive": 

                        control.initResponsiveTrigger( ast_field_wrap, control_elem ); 

                        control.container.on( 'change keyup paste', 'input.ast-responsive-input, select.ast-responsive-select', function() {
            
                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );

                            // Update value on change.
                            control.updateResonsiveValue( jQuery(this), name );
                        });

                    break;

                    case "ast-select":

                        control.container.on( 'change', '.ast-select-input', function() {

                            var value = jQuery( this ).val();

                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );  

                            control.container.trigger( 'ast_settings_changed', [ control, jQuery(this), value, name ] );
                        });

                    break;

                    case "ast-slider": 
                    
                        control.container.on('input change', 'input[type=range]', function () {
                            var value = jQuery(this).attr('value'),
                                input_number = jQuery(this).closest('.wrapper').find('.astra_range_value .value');

                            input_number.val(value);

                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );

                            control.container.trigger('ast_settings_changed', [control, input_number, value, name]);
                        });

                        // Handle the reset button.
                        control.container.on( 'click', '.ast-slider-reset', function () {

                            var wrapper = jQuery(this).closest('.wrapper'),
                                input_range = wrapper.find('input[type=range]'),
                                input_number = wrapper.find('.astra_range_value .value'),
                                default_value = input_range.data('reset_value');

                            input_range.val(default_value);
                            input_number.val(default_value);

                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );

                            control.container.trigger('ast_settings_changed', [control, input_number, default_value, name]);
                        });

                        // Save changes.
                        control.container.find( '.customize-control-ast-slider' ).on('input change', 'input[type=number]', function () {

                            var value = jQuery(this).val();
                            jQuery(this).closest('.wrapper').find('input[type=range]').val(value);

                            name = $(this).parents( '.customize-control' ).attr( 'id' );
                            name = name.replace( 'customize-control-', '' );
    
                            control.container.trigger('ast_settings_changed', [control, jQuery(this), value, name]);
                        });

                    break;

                    case "ast-responsive-background":

                        control.initAstResonsiveBgControl( control_elem, control_type, control_type.name );

                    break;

                    case "ast-background":

                        control.initAstBgControl( control_elem, control_type, control_type.name );

                    break;

                    case "ast-border":

                        control.initAstBorderControl( control_elem, control_type, control_type.name );

                    break;
                }

            });

            wrap.find( '.ast-field-settings-modal' ).data( 'loaded', true );
            
        },

        initAstBorderControl: function( control_elem, control_type, name ) {

            var control = this,
                value            = control.setting._value,
                control_name     = control_type.name;
            
            // Save the value.
            this.container.on( 'change keyup paste', 'input.ast-border-input', function() {

                // Update value on change.
                control.saveBorderValue( 'border', jQuery( this ).val(), jQuery( this ), name );

            });

            // Connected button
            jQuery( '.ast-border-connected' ).on( 'click', function() {

                // Remove connected class
                jQuery(this).parent().parent( '.ast-border-wrapper' ).find( 'input' ).removeClass( 'connected' ).attr( 'data-element-connect', '' );
                
                // Remove class
                jQuery(this).parent( '.ast-border-input-item-link' ).removeClass( 'disconnected' );

            } );

            // Disconnected button
            jQuery( '.ast-border-disconnected' ).on( 'click', function() {

                // Set up variables
                var elements    = jQuery(this).data( 'element-connect' );
                
                // Add connected class
                jQuery(this).parent().parent( '.ast-border-wrapper' ).find( 'input' ).addClass( 'connected' ).attr( 'data-element-connect', elements );

                // Add class
                jQuery(this).parent( '.ast-border-input-item-link' ).addClass( 'disconnected' );

            } );

            // Values connected inputs
            jQuery( '.ast-border-input-item' ).on( 'input', '.connected', function() {

                var dataElement       = jQuery(this).attr( 'data-element-connect' ),
                    currentFieldValue = jQuery( this ).val();

                jQuery(this).parent().parent( '.ast-border-wrapper' ).find( '.connected[ data-element-connect="' + dataElement + '" ]' ).each( function( key, value ) {
                    jQuery(this).val( currentFieldValue ).change();
                } );

            } );
        },

        generateFieldHtml: function ( fields_data, field_values ) {    

            var fields_html = '';
            var control_types = [];


            _.each(fields_data, function (attr, index) {

                new_value = ( wp.customize.control( 'astra-settings['+attr.name+']' ) ? wp.customize.control( 'astra-settings['+attr.name+']' ).params.value : '' ); 
                var control = attr.control;
                var template_id = "customize-control-" + control + "-content";
                var template = wp.template(template_id);
                var value = new_value || attr.default;
                attr.value = value;
                var dataAtts = '';
                var input_attrs = '';

                attr.label = attr.title;

                // Data attributes.
                _.each( attr.data_attrs, function( value, name ) {
                    dataAtts += " data-" + name + " ='" + value + "'";
                });

                // Input attributes
                _.each( attr.input_attrs, function ( value, name ) {
                    input_attrs += name + " ='" + value + "'";
                });

                attr.dataAttrs = dataAtts;
                attr.inputAttrs = input_attrs;

                control_types.push({
                    key: control,
                    value: value,
                    name: attr.name
                });

                if ('ast-responsive' == control) {
                    var is_responsive = 'undefined' == typeof attr.responsive ? true : attr.responsive;
                    attr.responsive = is_responsive;
                }

                var control_clean_name = attr.name.replace('[', '-');
                control_clean_name = control_clean_name.replace(']', '');

                fields_html += "<li id='customize-control-" + control_clean_name + "' class='customize-control customize-control-" + attr.control + "' >";
                fields_html += template(attr);
                fields_html += '</li>';

            });

            var result = new Object();

            result.controls = control_types;
            result.html     = fields_html;

            return result;
        },

        generateDropdownHtml: function( weightObject, element ) {

            var currentWeightTitle  = element.data( 'inherit' );
            var weightOptions       = '';
            var inheritWeightObject = [ 'inherit' ];
            var counter = 0;
            var weightObject        = $.merge( inheritWeightObject, weightObject );
            var weightValue         = element.val() || '400';
            astraTypo[ 'inherit' ] = currentWeightTitle;

            for ( ; counter < weightObject.length; counter++ ) {

                if ( 0 === counter && -1 === $.inArray( weightValue, weightObject ) ) {
                    weightValue = weightObject[ 0 ];
                    selected 	= ' selected="selected"';
                } else {
                    selected = weightObject[ counter ] == weightValue ? ' selected="selected"' : '';
                }
                if( ! weightObject[ counter ].includes( "italic" ) ){
                    weightOptions += '<option value="' + weightObject[ counter ] + '"' + selected + '>' + astraTypo[ weightObject[ counter ] ] + '</option>';
                }
            }
            
            element.html( weightOptions );
        },

        initResponsiveTrigger: function( wrap, control_elem ) {

            wrap.find('.ast-responsive-btns button').on('click', function (event) {

                var device = jQuery(this).attr('data-device');
                if ('desktop' == device) {
                    device = 'tablet';
                } else if ('tablet' == device) {
                    device = 'mobile';
                } else {
                    device = 'desktop';
                }

                jQuery('.wp-full-overlay-footer .devices button[data-device="' + device + '"]').trigger('click');
            });

        },

        initColor: function ( wrap, control_elem, name ) {

            var control = this;
            var picker = wrap.find('.customize-control-ast-color .ast-color-picker-alpha');

            picker.wpColorPicker({

                change: function (event, ui) {

                    if ('undefined' != typeof event.originalEvent || 'undefined' != typeof ui.color._alpha) {
                    
                        var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];
                        jQuery(element).val( ui.color.toString() );
                        name = jQuery(element).parents('.customize-control').attr('id');
                        name = name.replace( 'customize-control-', '' );
                        control.container.trigger( 'ast_settings_changed', [control, jQuery( element ), ui.color.toString(), name ] );
                    }
                },

                /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event) {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];
                    jQuery(element).val('');

                    name = jQuery(element).parents('.customize-control').attr('id');
                    name = name.replace( 'customize-control-', '' );
                    control.container.trigger( 'ast_settings_changed', [control, jQuery(element), '', name ] );
                    wp.customize.previewer.refresh();
                }
            });
        },

        initResponsiveColor: function( wrap, control_elem, name ) {

            var control = this;
            var picker = wrap.find( '.ast-responsive-color' );

            picker.wpColorPicker({

                change: function(event, ui) {

                    if ('undefined' != typeof event.originalEvent || 'undefined' != typeof ui.color._alpha) {
                        if ( jQuery('html').hasClass('responsive-background-color-ready') ) {

                            var option_name = jQuery(this).data('name');
                            var stored = {
                                'desktop' : jQuery( ".desktop.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                                'tablet'  : jQuery( ".tablet.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                                'mobile'  : jQuery( ".mobile.ast-responsive-color[data-name='"+ option_name +"']" ).val()
                            };

                            var element = event.target;
                            var device = jQuery( this ).data( 'id' );
                            var newValue = {
                                'desktop' : stored['desktop'],
                                'tablet'  : stored['tablet'],
                                'mobile'  : stored['mobile'],
                            };
                            if ( 'desktop' === device ) {
                                newValue['desktop'] = ui.color.toString();
                            }
                            if ( 'tablet' === device ) {
                                newValue['tablet'] = ui.color.toString();
                            }
                            if ( 'mobile' === device ) {
                                newValue['mobile'] = ui.color.toString();
                            }

                            jQuery(element).val( ui.color.toString() );

                            name = jQuery(element).parents('.customize-control').attr('id');
                            name = name.replace( 'customize-control-', '' );

                            control.container.trigger( 'ast_settings_changed', [ control, jQuery(this), newValue, name ] );
                        }
                    }
                },

                    /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event) {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0],
                        device = jQuery( this ).closest('.wp-picker-input-wrap').find('.wp-color-picker').data( 'id' );

                    var option_name = jQuery( element ).attr('data-name');
                    var stored = {
                        'desktop' : jQuery( ".desktop.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                        'tablet'  : jQuery( ".tablet.ast-responsive-color[data-name='"+ option_name +"']" ).val(),
                        'mobile'  : jQuery( ".mobile.ast-responsive-color[data-name='"+ option_name +"']" ).val()
                    };

                    var newValue = {
                        'desktop' : stored['desktop'],
                        'tablet'  : stored['tablet'],
                        'mobile'  : stored['mobile'],
                    };

                    wp.customize.previewer.refresh();

                    if ( element ) {
                        if ( 'desktop' === device ) {
                            newValue['desktop'] = '';
                        }
                        if ( 'tablet' === device ) {
                            newValue['tablet'] = '';
                        }
                        if ( 'mobile' === device ) {
                            newValue['mobile'] = '';
                        }

                        jQuery(element).val( '' );
                        control.container.trigger( 'ast_settings_changed', [ control, jQuery(element), newValue, name ] );
                    }

                    name = jQuery(element).parents('.customize-control').attr('id');
                    name = name.replace( 'customize-control-', '' );
                }
            });

            wrap.find( '.ast-responsive-btns button' ).on( 'click', function( event ) {

                var device = jQuery(this).attr('data-device');
                if( 'desktop' == device ) {
                    device = 'tablet';
                } else if( 'tablet' == device ) {
                    device = 'mobile';
                } else {
                    device = 'desktop';
                }

                jQuery( '.wp-full-overlay-footer .devices button[data-device="' + device + '"]' ).trigger( 'click' );
            });

            // Set desktop colorpicker active.
            wrap.find( '.ast-responsive-color.desktop' ).parents( '.wp-picker-container' ).addClass( 'active' );
        },

        onOptionChange:function ( e, control, element, value, name ) {

            var control_id  = $( '.hidden-field-astra-settings-' + name );
            control_id.val( value );
            sub_control = wp.customize.control( "astra-settings[" + name + "]" );
            sub_control.setting.set( value );
        },

        /**
         * Updates the responsive param value.
         */
        updateResonsiveValue: function( element, name ) {

            'use strict';

            var control = this,
            newValue = {};

            // Set the spacing container.
            control.responsiveContainer = element.closest( '.ast-responsive-wrapper' );

            control.responsiveContainer.find( 'input.ast-responsive-input' ).each( function() {
                var responsive_input = jQuery( this ),
                item = responsive_input.data( 'id' ),
                item_value = responsive_input.val();

                newValue[item] = item_value;
            });

            control.responsiveContainer.find( 'select.ast-responsive-select' ).each( function() {
                var responsive_input = jQuery( this ),
                item = responsive_input.data( 'id' ),
                item_value = responsive_input.val();

                newValue[item] = item_value;
            });

            control.container.trigger( 'ast_settings_changed', [ control, element, newValue, name ] );
        },

        isJsonString: function( str ) {

            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },   

        initAstResonsiveBgControl: function( control, control_atts, name ) {

            var value            = control_atts.value;
            var picker           = control.container.find('.ast-responsive-bg-color-control');
            var control_name     = control_atts.name;
            var controlContainer = control.container.find( "#customize-control-" + control_name );

            // Hide unnecessary controls if the value doesn't have an image.
            if (_.isUndefined(value['desktop']['background-image']) || '' === value['desktop']['background-image']) {   
                controlContainer.find('.background-wrapper > .background-container.desktop > .background-repeat').hide();
                controlContainer.find('.background-wrapper > .background-container.desktop > .background-position').hide();
                controlContainer.find('.background-wrapper > .background-container.desktop > .background-size').hide();
                controlContainer.find('.background-wrapper > .background-container.desktop > .background-attachment').hide();
            }
            if (_.isUndefined(value['tablet']['background-image']) || '' === value['tablet']['background-image']) {
                controlContainer.find('.background-wrapper > .background-container.tablet > .background-repeat').hide();
                controlContainer.find('.background-wrapper > .background-container.tablet > .background-position').hide();
                controlContainer.find('.background-wrapper > .background-container.tablet > .background-size').hide();
                controlContainer.find('.background-wrapper > .background-container.tablet > .background-attachment').hide();
            }
            if (_.isUndefined(value['mobile']['background-image']) || '' === value['mobile']['background-image']) {
                controlContainer.find('.background-wrapper > .background-container.mobile > .background-repeat').hide();
                controlContainer.find('.background-wrapper > .background-container.mobile > .background-position').hide();
                controlContainer.find('.background-wrapper > .background-container.mobile > .background-size').hide();
                controlContainer.find('.background-wrapper > .background-container.mobile > .background-attachment').hide();
            }

            // Color.
            picker.wpColorPicker({
                change: function (event, ui) {

                    if ('undefined' != typeof event.originalEvent || 'undefined' != typeof ui.color._alpha ) {
                        var device = jQuery(this).data('id');
                        control.saveValue( device, 'background-color', ui.color.toString(), jQuery(this), name );
                    }
                },

                /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event) {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0],
                        responsive_input = jQuery(this),
                        screen = responsive_input.closest('.wp-picker-input-wrap').find('.wp-color-picker').data('id');

                    if ( element ) {
                        control.saveValue( screen, 'background-color', '', jQuery( element ), name );
                    }
                    wp.customize.previewer.refresh();
                }
            });

            // Background-Repeat.
            controlContainer.on('change', '.background-repeat select', function () {
                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id'),
                    item_value = responsive_input.val();

                control.saveValue( screen, 'background-repeat', item_value, jQuery(this), name );
            });

            // Background-Size.
            controlContainer.on('change click', '.background-size input', function () {
                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id'),
                    item_value = responsive_input.val();

                jQuery( this ).parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
                jQuery( this ).attr( 'checked', 'checked' );

                control.saveValue( screen, 'background-size', item_value, responsive_input, name );
            });

            // Background-Position.
            controlContainer.on( 'change', '.background-position select', function () {
                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id'),
                    item_value = responsive_input.val();
                control.saveValue( screen, 'background-position', item_value, responsive_input, name );
            });

            // Background-Attachment.
            controlContainer.on('change click', '.background-attachment input', function () {
                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id'),
                    item_value = responsive_input.val();

                jQuery( this ).parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
                jQuery( this ).attr( 'checked', 'checked' );

                control.saveValue( screen, 'background-attachment', item_value, responsive_input, name );
            });

            // Background-Image.
            controlContainer.on('click', '.background-image-upload-button, .thumbnail-image img', function (e) {
                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id');
                    name = responsive_input.data('name');

                var image = wp.media({ multiple: false }).open().on('select', function () {

                    // This will return the selected image from the Media Uploader, the result is an object.
                    var uploadedImage = image.state().get('selection').first(),
                        previewImage = uploadedImage.toJSON().sizes.full.url,
                        imageUrl,
                        imageID,
                        imageWidth,
                        imageHeight,
                        preview,
                        removeButton;

                    if (!_.isUndefined(uploadedImage.toJSON().sizes.medium)) {
                        previewImage = uploadedImage.toJSON().sizes.medium.url;
                    } else if (!_.isUndefined(uploadedImage.toJSON().sizes.thumbnail)) {
                        previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
                    }

                    imageUrl = uploadedImage.toJSON().sizes.full.url;
                    imageID = uploadedImage.toJSON().id;
                    imageWidth = uploadedImage.toJSON().width;
                    imageHeight = uploadedImage.toJSON().height;

                    // Show extra controls if the value has an image.
                    if ( '' !== imageUrl ) {
                        controlContainer.find('.background-wrapper > .background-repeat, .background-wrapper > .background-position, .background-wrapper > .background-size, .background-wrapper > .background-attachment').show();
                    }

                    control.saveValue( screen, 'background-image', imageUrl, responsive_input, name );
                    preview = controlContainer.find( '.background-container.' + screen + ' .placeholder, .background-container.' + screen + ' .thumbnail' );
                    removeButton = controlContainer.find('.background-container.' + screen + ' .background-image-upload-remove-button');

                    if ( preview.length ) {
                        preview.removeClass().addClass('thumbnail thumbnail-image').html('<img src="' + previewImage + '" alt="" data-id="'+screen+'" data-name="'+name+'"/>');
                    }
                    if ( removeButton.length ) {
                        removeButton.show();
                    }
                });

                e.preventDefault();
            });

            controlContainer.on('click', '.background-image-upload-remove-button', function (e) {

                var preview,
                    removeButton,
                    responsive_input = jQuery(this),
                    screen = responsive_input.data('id');

                control.saveValue( screen, 'background-image', '', jQuery(this), name );

                preview = controlContainer.find('.background-container.' + screen + ' .placeholder, .background-container.' + screen + ' .thumbnail');
                removeButton = controlContainer.find('.background-container.' + screen + ' .background-image-upload-remove-button');

                // Hide unnecessary controls.
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-repeat').hide();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-position').hide();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-size').hide();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-attachment').hide();

                controlContainer.find('.background-container.' + screen + ' .more-settings').attr('data-direction', 'down');
                controlContainer.find('.background-container.' + screen + ' .more-settings').find('.message').html(astraCustomizerControlBackground.moreSettings);
                controlContainer.find('.background-container.' + screen + ' .more-settings').find('.icon').html('↓');

                if (preview.length) {
                    preview.removeClass().addClass('placeholder').html(astraCustomizerControlBackground.placeholder);
                }
                if (removeButton.length) {
                    removeButton.hide();
                }

                wp.customize.previewer.refresh();
                e.preventDefault();
            });

            controlContainer.on('click', '.more-settings', function (e) {

                var responsive_input = jQuery(this),
                    screen = responsive_input.data('id');
                // Hide unnecessary controls.
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-repeat').toggle();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-position').toggle();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-size').toggle();
                controlContainer.find('.background-wrapper > .background-container.' + screen + ' > .background-attachment').toggle();

                if ('down' === $(this).attr('data-direction')) {
                    $(this).attr('data-direction', 'up');
                    $(this).find('.message').html(astraCustomizerControlBackground.lessSettings)
                    $(this).find('.icon').html('↑');
                } else {
                    $(this).attr('data-direction', 'down');
                    $(this).find('.message').html(astraCustomizerControlBackground.moreSettings)
                    $(this).find('.icon').html('↓');
                }
            });


            controlContainer.find('.ast-responsive-btns button').on('click', function (event) {

                var device = jQuery(this).attr('data-device');
                if ('desktop' == device) {
                    device = 'tablet';
                } else if ('tablet' == device) {
                    device = 'mobile';
                } else {
                    device = 'desktop';
                }

                jQuery('.wp-full-overlay-footer .devices button[data-device="' + device + '"]').trigger('click');
            });

            jQuery(' .wp-full-overlay-footer .devices button ').on('click', function () {

                var device = jQuery(this).attr('data-device');

                jQuery('.customize-control-ast-responsive-background .background-container, .customize-control .ast-responsive-btns > li').removeClass('active');
                jQuery('.customize-control-ast-responsive-background .background-container.' + device + ', .customize-control .ast-responsive-btns > li.' + device).addClass('active');
            });
        },

        initAstBgControl: function( control, control_atts, name ) {

            var value            = control.setting._value,
                control_name     = control_atts.name,
                picker           = control.container.find( '.ast-color-control' ),
                controlContainer = control.container.find( "#customize-control-" + control_name );

            // Hide unnecessary controls if the value doesn't have an image.
            if ( _.isUndefined( value['background-image']) || '' === value['background-image']) {
                controlContainer.find( '.background-wrapper > .background-repeat' ).hide();
                controlContainer.find( '.background-wrapper > .background-position' ).hide();
                controlContainer.find( '.background-wrapper > .background-size' ).hide();
                controlContainer.find( '.background-wrapper > .background-attachment' ).hide();
            }

            // Color.
            picker.wpColorPicker({
                change: function() {
                    if ( jQuery('html').hasClass('background-colorpicker-ready') ) {
                        var $this = jQuery(this);
                        setTimeout( function() {
                            control.saveBgValue( 'background-color', picker.val(), $this, name );
                        }, 100 );
                    }
                },

                /**
                 * @param {Event} event - standard jQuery event, produced by "Clear"
                 * button.
                 */
                clear: function (event)
                {
                    var element = jQuery(event.target).closest('.wp-picker-input-wrap').find('.wp-color-picker')[0];

                    if (element) {
                        control.saveBgValue( 'background-color', '', jQuery(element), name );
                    }
                    wp.customize.previewer.refresh();
                }
            });

            // Background-Repeat.
            controlContainer.on( 'change', '.background-repeat select', function() {
                control.saveBgValue( 'background-repeat', jQuery( this ).val(), jQuery( this ), name );
            });

            // Background-Size.
            controlContainer.on( 'change click', '.background-size input', function() {
                jQuery( this ).parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
                jQuery( this ).attr( 'checked', 'checked' );
                control.saveBgValue( 'background-size', jQuery( this ).val(), jQuery( this ), name );
            });

            // Background-Position.
            controlContainer.on( 'change', '.background-position select', function() {
                control.saveBgValue( 'background-position', jQuery( this ).val(), jQuery( this ), name );
            });

            // Background-Attachment.
            controlContainer.on( 'change click', '.background-attachment input', function() {
                jQuery( this ).parent( '.buttonset' ).find( '.switch-input' ).removeAttr('checked');
                jQuery( this ).attr( 'checked', 'checked' );
                control.saveBgValue( 'background-attachment', jQuery( this ).val(), jQuery( this ), name );
            });

            // Background-Image.
            controlContainer.on( 'click', '.background-image-upload-button, .thumbnail-image img', function( e ) {
                var upload_img_btn = jQuery(this);
                var image = wp.media({ multiple: false }).open().on( 'select', function() {

                    // This will return the selected image from the Media Uploader, the result is an object.
                    var uploadedImage = image.state().get( 'selection' ).first(),
                        previewImage   = uploadedImage.toJSON().sizes.full.url,
                        imageUrl,
                        imageID,
                        imageWidth,
                        imageHeight,
                        preview,
                        removeButton;

                    if ( ! _.isUndefined( uploadedImage.toJSON().sizes.medium ) ) {
                        previewImage = uploadedImage.toJSON().sizes.medium.url;
                    } else if ( ! _.isUndefined( uploadedImage.toJSON().sizes.thumbnail ) ) {
                        previewImage = uploadedImage.toJSON().sizes.thumbnail.url;
                    }

                    imageUrl    = uploadedImage.toJSON().sizes.full.url;
                    imageID     = uploadedImage.toJSON().id;
                    imageWidth  = uploadedImage.toJSON().width;
                    imageHeight = uploadedImage.toJSON().height;

                    // Show extra controls if the value has an image.
                    if ( '' !== imageUrl ) {
                        controlContainer.find( '.background-wrapper > .background-repeat, .background-wrapper > .background-position, .background-wrapper > .background-size, .background-wrapper > .background-attachment' ).show();
                    }

                    control.saveBgValue( 'background-image', imageUrl, upload_img_btn, name );
                    preview      = controlContainer.find( '.placeholder, .thumbnail' );
                    removeButton = controlContainer.find( '.background-image-upload-remove-button' );

                    if ( preview.length ) {
                        preview.removeClass().addClass( 'thumbnail thumbnail-image' ).html( '<img src="' + previewImage + '" alt="" />' );
                    }
                    if ( removeButton.length ) {
                        removeButton.show();
                    }
                });

                e.preventDefault();
            });

            controlContainer.on( 'click', '.background-image-upload-remove-button', function( e ) {

                var preview,
                    removeButton;

                e.preventDefault();

                control.saveBgValue( 'background-image', '', jQuery( this ) );

                preview      = controlContainer.find( '.placeholder, .thumbnail' );
                removeButton = controlContainer.find( '.background-image-upload-remove-button' );

                // Hide unnecessary controls.
                controlContainer.find( '.background-wrapper > .background-repeat' ).hide();
                controlContainer.find( '.background-wrapper > .background-position' ).hide();
                controlContainer.find( '.background-wrapper > .background-size' ).hide();
                controlContainer.find( '.background-wrapper > .background-attachment' ).hide();
                
                controlContainer.find( '.more-settings' ).attr('data-direction', 'down');
                controlContainer.find( '.more-settings' ).find('.message').html( astraCustomizerControlBackground.moreSettings );
                controlContainer.find( '.more-settings' ).find('.icon').html( '↓' );

                if ( preview.length ) {
                    preview.removeClass().addClass( 'placeholder' ).html( astraCustomizerControlBackground.placeholder );
                }
                if ( removeButton.length ) {
                    removeButton.hide();
                }
            });

            controlContainer.on( 'click', '.more-settings', function( e ) {
                // Hide unnecessary controls.
                controlContainer.find( '.background-wrapper > .background-repeat' ).toggle();
                controlContainer.find( '.background-wrapper > .background-position' ).toggle();
                controlContainer.find( '.background-wrapper > .background-size' ).toggle();
                controlContainer.find( '.background-wrapper > .background-attachment' ).toggle();

                if( 'down' === $(this).attr( 'data-direction' ) )
                {
                    $(this).attr('data-direction', 'up');
                    $(this).find('.message').html( astraCustomizerControlBackground.lessSettings )
                    $(this).find('.icon').html( '↑' );
                } else {
                    $(this).attr('data-direction', 'down');
                    $(this).find('.message').html( astraCustomizerControlBackground.moreSettings )
                    $(this).find('.icon').html( '↓' );
                }
            });
        },

        saveValue: function ( screen, property, value, element, name ) {

            var control = this,
                input = jQuery('#customize-control-' + control.id.replace('[', '-').replace(']', '') + ' .responsive-background-hidden-value'); 

            var val = JSON.parse( input.val() );
            val[screen][property] = value;

            jQuery(input).attr( 'value', JSON.stringify(val) ).trigger( 'change' );

            name = jQuery(element).parents('.customize-control').attr('id');
            name = name.replace( 'customize-control-', '' );
            control.container.trigger( 'ast_settings_changed', [control, element, val, name ] );
        },

        /**
         * Saves the value.
         */
        saveBgValue: function( property, value, element, name ) {

            var control = this,
                input   = jQuery( '#customize-control-' + control.id.replace( '[', '-' ).replace( ']', '' ) + ' .background-hidden-value' );

            var val = JSON.parse( input.val() );

            val[ property ] = value;

            jQuery( input ).attr( 'value', JSON.stringify( val ) ).trigger( 'change' );

            name = jQuery(element).parents('.customize-control').attr('id');
            name = name.replace( 'customize-control-', '' );
            control.container.trigger( 'ast_settings_changed', [control, element, val, name ] );
        },

        /**
         * Saves the value.
         */
        saveBorderValue: function( property, value, element, name ) {

            var control = this,
                newValue = {
                    'top'   : '',
                    'right' : '',
                    'bottom' : '',
                    'left'   : '',
                };


            control.container.find( 'input.ast-border-desktop' ).each( function() {
                var spacing_input = jQuery( this ),
                    item          = spacing_input.data( 'id' );

                item_value = spacing_input.val();
                newValue[ item ] = item_value;
                
                spacing_input.attr( 'value', item_value );

            });

            
            control.container.trigger( 'ast_settings_changed', [control, element, newValue, name ] );
        }
    });

})(jQuery);
