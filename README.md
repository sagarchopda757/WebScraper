# WebScraper

# Amazon Web Scraper with Email Support

## Description

This is a web scraper built in Node.js that extracts product information from the Amazon website. It uses the Puppeteer library to automate browser interactions and retrieve data from Amazon product pages. Additionally, it provides the functionality to send the scraped data to a user-specified email address.

## Prerequisites

Before running the scraper, make sure you have the following installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory: `cd amazon-web-scraper`
3. Install the required dependencies: `npm install`
4. Run the script using `npm start`

## Usage

To use the web scraper and send scraped data via email, follow these steps:

1. Open the `index.js` file and update the following variables:
   - `URL`: Set the Amazon product page URL you want to scrape.
   - `recipientEmail`: Set the recipient's email address to send the scraped data.
   - `yourEmail`: Set your email address (sender) for sending the data.
   - `yourPassword`: Set your app Password to send Email to the recipient`s 

2. Run the scraper using the following command: `node index.js`
3. The scraper will launch a headless browser, navigate to the specified Amazon product page, and extract relevant data.
4. The extracted data, including a JSON file and images of the scraped page, will be sent to the recipient's email address.

## Output

The scraper extracts the following information from the Amazon product page:

- Product Title
- Price
- Rating
- Reviews Count
- Deals
- Bestseller

The extracted data will be presented in a structured format and sent to the specified email address.

### Sample JSON Data

Here's an example of the extracted data in JSON format:

```json
[{
"title": "Product Title",
"rating": "4.3 out of 5 stars",
"price": "₹249",
"image": "https://m.media-amazon.com/images/I/61o0Po9zWoL._AC_UL320_.jpg",
"bestSeller": null,
"deal": null
}]
```
### Demo

Here are some sample images from the scraped Amazon product page:
![Scraped_Data_image](https://github.com/sagarchopda757/WebScraper/blob/main/public/images/page_1.png)

