## About

Jekyll + GitHub pages site for https://www.trekview.org

Pages branch (protected) hosts Github pages build for: [https://www.trekview.org](https://www.trekview.org)

## Install

Install the dependencies with Bundler:

`bundle install`

Run jekyll commands through Bundler to ensure you're using the right versions:

`bundle exec jekyll serve`

## Creating new blog posts

We'd love contributions from photographers who want to share their Street View Tours.

If you're not technical, or want some help crafting a post, [contact us here](https://www.trekview.org/contact)

Want to go it alone? Great!

Here's our general guide for creating new posts:

1. Create a new branch of this repository with your post name, or something descriptive
2. Check out some of our existing posts for some inspiration. You can use an existing post as a template
3. Create a new file under `/_posts` with a name in the format `YEAR-MONTH-DATE-TITLE.md`
4. We keep blog images under `/images/blog/DATE_OF_POST`. If you want to add images, please place them here and reference from your post. 
5. Create an author record under `_staff_members` using the `_defaults.md` file as a template. Make sure to include your author name in your posts frontmatter.
6. Ensure all the frontmatter is accurate (title, description and images are most important), and set `published: false`.
7. Test you post before submitting a push request to publish. To preview your site locally, you can use `bundle exec jekyll serve --unpublished`
8. If everything looks good, commit the changes to the repository and submit a new pull request.

We will review and proofread all posts prior to merging pull requests. If we have any feedback, we'll let you know.

Thanks in advance for your contributions -- we look forward to viewing your photos!

## Developing

### Jekyll 

Built with [Jekyll](http://jekyllrb.com/) version 3.7.4, but should support newer versions as well.

## Github pages

We use the pages branch to publish to Github pages.

Before merging any changes to master, check for 404's:

`bundle exec htmlproofer ./_site`

## License

The code of this site is licensed under the [GNU Affero General Public License v3.0](LICENSE.txt).