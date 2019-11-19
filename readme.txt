=== Athena Gravity Forms ===
Contributors: ucfwebcom
Tags: ucf, athena-framework, gravityforms
Requires at least: 4.7.3
Tested up to: 5.3
Stable tag: 1.0.4
Requires PHP: 5.4
License: GPLv3 or later
License URI: http://www.gnu.org/copyleft/gpl-3.0.html

WordPress plugin that provides Athena Framework styling for Gravity Forms.


== Description ==

This plugin provides plug-and-go styling for [Gravity Forms](http://www.gravityforms.com/) on sites that utilize the [Athena Framework](https://ucf.github.io/Athena-Framework/).

= Known Caveats/Missing Features =

Most form configurations should work out-of-the-box, but please note that the following are not yet supported:
- Left and right-aligned labels
- [CSS-ready classes](https://www.gravityhelp.com/documentation/article/css-ready-classes/)
- "Enhanced user interface" fields
- Athena custom form inputs

Due to how Gravity Forms wraps advanced fields in containers with their sublabels, sublabels will only span the width of the field.  Long custom sublabels may wrap to a new line in unexpected ways.


== Installation ==

= Manual Installation =
1. Upload the plugin files (unzipped) to the `/wp-content/plugins` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the "Plugins" screen in WordPress

= WP CLI Installation =
1. `$ wp plugin install --activate https://github.com/UCF/Athena-GravityForms-Plugin/archive/master.zip`.  See [WP-CLI Docs](http://wp-cli.org/commands/plugin/install/) for more command options.


== Changelog ==

= 1.0.4 =
Enhancements:
* Upgraded packages, including the Athena Framework, to latest versions
* Updated linter configs
* Replaced old scss-lint rules with sass-lint rules; cleaned up linter issues

= 1.0.3 =
Miscellaneous:
* Upgraded node dependencies
* Added linter configs, a CONTRIBUTING doc, and issue templates to the project

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


== Development ==

Note that compiled, minified css files are included within the repo.  Changes to these files should be tracked via git (so that users installing the plugin using traditional installation methods will have a working plugin out-of-the-box.)

[Enabling debug mode](https://codex.wordpress.org/Debugging_in_WordPress) in your `wp-config.php` file is recommended during development to help catch warnings and bugs.

= Requirements =
* node
* gulp-cli

= Instructions =
1. Clone the Athena-GravityForms-Plugin repo into your local development environment, within your WordPress installation's `plugins/` directory: `git clone https://github.com/UCF/Athena-GravityForms-Plugin.git`
2. `cd` into the new Athena-GravityForms-Plugin directory, and run `npm install` to install required packages for development into `node_modules/` within the repo
3. Optional: If you'd like to enable [BrowserSync](https://browsersync.io) for local development, or make other changes to this project's default gulp configuration, copy `gulp-config.template.json`, make any desired changes, and save as `gulp-config.json`.

    To enable BrowserSync, set `sync` to `true` and assign `syncTarget` the base URL of a site on your local WordPress instance that will use this plugin, such as `http://localhost/wordpress/my-site/`.  Your `syncTarget` value will vary depending on your local host setup.

    The full list of modifiable config values can be viewed in `gulpfile.js` (see `config` variable).
3. Run `gulp default` to process front-end assets.
4. If you haven't already done so, create a new WordPress site on your development environment to test this plugin against, and install and activate GravityForms.
5. Activate this plugin on your development WordPress site.
7. Run `gulp watch` to continuously watch changes to scss files.  If you enabled BrowserSync in `gulp-config.json`, it will also reload your browser when plugin files change.

= Other Notes =
* This plugin's README.md file is automatically generated. Please only make modifications to the README.txt file, and make sure the `gulp readme` command has been run before committing README changes.  See the [contributing guidelines](https://github.com/UCF/Athena-GravityForms-Plugin/blob/master/CONTRIBUTING.md) for more information.


== Contributing ==

Want to submit a bug report or feature request?  Check out our [contributing guidelines](https://github.com/UCF/Athena-GravityForms-Plugin/blob/master/CONTRIBUTING.md) for more information.  We'd love to hear from you!
