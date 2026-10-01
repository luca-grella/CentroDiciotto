# Hypermedia Applications: Technology Part

Gilardi Luca - 828749
Grella Luca - 806717
Marisca Ivan - 828458


This is the repository for our project of the Hypermedia Applications course (academic year 2017/18).

Used frameworks: NodeJS (v 20+), NPM, jQuery, BootStrap.



All the data are queried from json files.

## Contact form configuration

The contact form sends messages to the clinic inbox through Gmail. Credentials are read from environment variables, never from the repository:

- `GMAIL_USER`: the Gmail address used to send the messages
- `GMAIL_APP_PASSWORD`: a Gmail [app password](https://support.google.com/accounts/answer/185833) (not the account password)
- `CONTACT_TO` (optional): where contact form messages are delivered, defaults to `GMAIL_USER`

If they are not set, the rest of the site works and the contact form answers with an error.
