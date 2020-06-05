## About

Jekyll + GitHub pages site for https://www.trekview.org

## Install locally

Clone the repo:

`git clone https://github.com/trek-view/basecamp`

Navigate to the repo directory:

`cd hq`

Install the dependencies with Bundler:

`bundle install`

Run jekyll commands through Bundler to ensure you're using the right versions:

`bundle exec jekyll serve`

## Developing

### Jekyll 

Built with [Jekyll](http://jekyllrb.com/) version 3.7.4, but should support newer versions as well.

## Github pages

Master branch hosts Github pages build for: [https://www.trekview.org](https://www.trekview.org)

Before merging any changes to master, check for 404's:

`bundle exec htmlproofer ./_site`

## License

The code of this site is licensed under a [MIT License](https://github.com/trek-view/basecamp/blob/master/LICENSE.txt).