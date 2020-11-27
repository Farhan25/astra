<?php
/**
 * Astra Theme Customizer Configuration Builder.
 *
 * @package     astra-builder
 * @author      Astra
 * @copyright   Copyright (c) 2020, Astra
 * @link        https://wpastra.com/
 * @since       3.0.0
 */

// No direct access, please.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Astra_Customizer_Config_Base' ) ) {
	return;
}

/**
 * Register Builder Customizer Configurations.
 *
 * @since 3.0.0
 */
class Astra_Header_Search_Component_Configs extends Astra_Customizer_Config_Base {


	/**
	 * Register Builder Customizer Configurations.
	 *
	 * @param Array                $configurations Astra Customizer Configurations.
	 * @param WP_Customize_Manager $wp_customize instance of WP_Customize_Manager.
	 * @since 3.0.0
	 * @return Array Astra Customizer Configurations with updated configurations.
	 */
	public function register_configuration( $configurations, $wp_customize ) {

		$_section = 'section-header-search';
		$defaults = Astra_Theme_Options::defaults();

		$_configs = array(

			/*
			* Header Builder section
			*/
			array(
				'name'     => $_section,
				'type'     => 'section',
				'priority' => 80,
				'title'    => __( 'Search', 'astra' ),
				'panel'    => 'panel-header-builder-group',
			),

			/**
			 * Option: Header Builder Tabs
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[hs-search-tabs]',
				'section'     => $_section,
				'type'        => 'control',
				'control'     => 'ast-builder-header-control',
				'priority'    => 0,
				'description' => '',
			),

			/**
			 * Option: Search Color.
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[header-search-icon-color]',
				'default'   => '',
				'type'      => 'control',
				'section'   => $_section,
				'priority'  => 8,
				'transport' => 'postMessage',
				'control'   => 'ast-color',
				'title'     => __( 'Icon Color', 'astra' ),
				'context'   => Astra_Builder_Helper::$design_tab,
			),

			/**
			 * Option: Search Size
			 */
			array(
				'name'        => ASTRA_THEME_SETTINGS . '[header-search-icon-space]',
				'section'     => $_section,
				'priority'    => 2,
				'transport'   => 'postMessage',
				'default'     => $defaults['header-search-icon-space'],
				'title'       => __( 'Icon Size', 'astra' ),
				'type'        => 'control',
				'control'     => 'ast-responsive-slider',
				'input_attrs' => array(
					'min'  => 0,
					'step' => 1,
					'max'  => 50,
				),
				'context'     => Astra_Builder_Helper::$general_tab,
			),

			/**
			 * Option: Margin heading
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin-heading]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Spacing', 'astra' ),
				'priority' => 200,
				'settings' => array(),
				'context'  => Astra_Builder_Helper::$design_tab,
			),

			/**
			 * Option: Margin Space
			 */
			array(
				'name'           => ASTRA_THEME_SETTINGS . '[' . $_section . '-margin]',
				'default'        => '',
				'type'           => 'control',
				'transport'      => 'postMessage',
				'control'        => 'ast-responsive-spacing',
				'section'        => $_section,
				'priority'       => 220,
				'title'          => __( 'Margin', 'astra' ),
				'linked_choices' => true,
				'unit_choices'   => array( 'px', 'em', '%' ),
				'choices'        => array(
					'top'    => __( 'Top', 'astra' ),
					'right'  => __( 'Right', 'astra' ),
					'bottom' => __( 'Bottom', 'astra' ),
					'left'   => __( 'Left', 'astra' ),
				),
				'context'        => Astra_Builder_Helper::$design_tab,
			),

			/**
			 * Option: Hide on heading
			 */
			array(
				'name'     => ASTRA_THEME_SETTINGS . '[' . $_section . '-visibility]',
				'type'     => 'control',
				'control'  => 'ast-heading',
				'section'  => $_section,
				'title'    => __( 'Visibility', 'astra' ),
				'priority' => 200,
				'settings' => array(),
			),


			/**
			 * Option: Hide on desktop
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $_section . '-hide-desktop]',
				'type'      => 'control',
				'control'   => 'checkbox',
				'default'   => astra_get_option( 'header-hide-desktop' ),
				'section'   => $_section,
				'priority'  => 210,
				'title'     => __( 'Hide on Desktop', 'astra' ),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-header-search',
					'container_inclusive' => false,
					'render_callback'     => array( Astra_Builder_Header::get_instance(), 'header_search' ),
				),
			),

			/**
			 * Option: Hide on tablet
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $_section . '-hide-tablet]',
				'type'      => 'control',
				'control'   => 'checkbox',
				'default'   => astra_get_option( 'header-hide-tablet' ),
				'section'   => $_section,
				'priority'  => 220,
				'title'     => __( 'Hide on Tablet', 'astra' ),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-header-search',
					'container_inclusive' => false,
					'render_callback'     => array( Astra_Builder_Header::get_instance(), 'header_search' ),
				),
			),

			/**
			 * Option: Hide on mobile
			 */
			array(
				'name'      => ASTRA_THEME_SETTINGS . '[' . $_section . '-hide-mobile]',
				'type'      => 'control',
				'control'   => 'checkbox',
				'default'   => astra_get_option( 'header-hide-mobile' ),
				'section'   => $_section,
				'priority'  => 230,
				'title'     => __( 'Hide on Mobile', 'astra' ),
				'transport' => 'postMessage',
				'partial'   => array(
					'selector'            => '.ast-header-search',
					'container_inclusive' => false,
					'render_callback'     => array( Astra_Builder_Header::get_instance(), 'header_search' ),
				),
			),

		);

		return array_merge( $configurations, $_configs );
	}
}

/**
 * Kicking this off by creating object of this class.
 */

new Astra_Header_Search_Component_Configs();

