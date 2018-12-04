=== Athena Gravity Forms ===
Contributors: ucfwebcom
Tags: ucf, athena-framework, gravityforms
Requires at least: 4.7.3
Tested up to: 4.7.3
Stable tag: 1.0.2
License: GPLv3 or later
License URI: http://www.gnu.org/copyleft/gpl-3.0.html

WordPress plugin that provides Athena Framework styling for Gravity Forms.


== Description ==

This plugin provides plug-and-go styling for [Gravity Forms](http://www.gravityforms.com/) on sites that utilize the [Athena Framework](https://ucf.github.io/Athena-Framework/).

= Known Caveats/Missing Features =

Most form configurations should work out-of-the-box, but please note that the following are not yet supported:
- Left and right-aligned labels
- [CSS-ready classes](https://www.gravityhelp.com/documentation/article/css-ready-classes/)
- Athena custom form inputs

Due to how Gravity Forms wraps advanced fields in containers with their sublabels, sublabels will only span the width of the field.  Long custom sublabels may wrap to a new line in unexpected ways.


== Installation ==

= Manual Installation =
1. Upload the plugin files (unzipped) to the `/wp-content/plugins` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the "Plugins" screen in WordPress

= WP CLI Installation =
1. `$ wp plugin install --activate https://github.com/UCF/Athena-GravityForms-Plugin/archive/master.zip`.  See [WP-CLI Docs](http://wp-cli.org/commands/plugin/install/) for more command options.


== Changelog ==

= 1.0.2 =
Bug fixes:
* Fixed sizing and positioning of list field add/delete buttons
* Added margin above progress bars when the form title or description is displayed above it
* Added character count text styles

= 1.0.1 =
Bug fixes:
* Added styles to hide honeypot validation fields.

= 1.0.0 =
* Initial release


== Upgrade Notice ==

n/a


== Installation Requirements ==

None


== Development & Contributing ==

NOTE: this plugin's readme.md file is automatically generated.  Please only make modifications to the readme.txt file, and make sure the `gulp readme` command has been run before committing readme changes.
