## About

Jekyll pages site for https://www.trekview.org

## Install locally

Clone the repo:

```shell
git clone https://github.com/trek-view/basecamp
cd basecamp
rbenv install 2.7.7
rbenv local 2.7.7
bundle install
bundle exec jekyll serve
```

Before merging any changes to master, check for 404's:

```shell
htmlproofer --assume-extension ./_site --url-swap '^/BASEURL/:/' --alt-ignore '/.*/'
```

* `--alt-ignore '/.*/'`: ignores empty img alt tags

## Hosting

The main branch of this repository is hosted by GitHub pages.

## License

* Code: [Apache 2.0](/LICENSE).
* Images: [CC BY-SA 4.0](/LICENSE-IMAGES).