# Webpack-build
## Config for Webpack 4
* HTML | PUG
* CSS | SASS | SCSS
* Babel | EsLint
* Inline SVG
    
     *Example*:

        from: <img markup-inline src="..." />
                            
        to: <svg markup-inline ...>...</svg>
        
    \* attribute markup-inline is required

## Commands
    npm run dev
    npm run start
    npm run build

## File structure
    dist/                # Build folder
    src/                 # Source
        app/                # JS files
        fonts/              # Fonts
        images/             # Images
        static/             # Static files
        styles/             # CSS | SCSS | SASS files
        template/           # HTML | PUG files
        index.js/           # Entry
