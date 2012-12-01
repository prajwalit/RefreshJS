# Can be :stand_alone or :rails. Defaults to :stand_alone.
project_type = :stand_alone

# The environment mode.
# Defaults to :production, can also be :development
# Use :development to see line numbers, file names, etc
environment = :production

# output option: nested, expanded, compact, compressed
output_style = :nested

# compass plugins

# Indicates whether the compass helper functions should generate relative urls from the generated css to assets,
# or absolute urls using the http path for that asset type.
relative_assets = true

# paths
http_path = "/"
images_dir = "/static/images/"
css_dir = "/static/css"
fonts_dir = "/static/fonts"
sass_dir = "scss"
javascripts_dir = "/static/js"

# Do not append that hash code at the end of image URLs
asset_cache_buster do |http_path, real_path|
  nil
end
