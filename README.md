# Hi WallStreetDocs,

> This README file contains my covering note, and installation instructions.

## Installation
Just run `npm install`, and `npm start`.

## Covering note
My charts shows:
* overview of average completion time for service reports, 
* the percentage of web hosts using encrypted connections or not (https/http)
* the percentage of the different http response status we got from the report
* I also tried to show the web of network calls between downstream hosts and upstream hosts. I used 2 different views: a sunburst and tree charts (3 charts in total)... to give a view of how the reports are gathered. This can make us prioties certain things like what servers need more upgrades, or attention. And I think this is where I would love to dig in more if I had more time. I wanted to know which web hosts were failing or not implementing the service report API.

I started out using chart.js for it's simplicity. I used it for pie charts because it's a basic chart and chart.js is sufficient enough for that. I had to use D3 because it's richer in features and interactivity. It has smooth animations and interactions that double as filtering too.

I've made sure to look out for accessibility and mobile responsiveness for the charts. By adding aria labels and roles, making sure the view port of the canvas, and svg chart always fits the screen. I also added fallback text for broswers that don't support the canvas HTML element used to draw some of the charts. One of my chart.js charts have patterns for easy distinction to account for color blindness. The same can be done for the D3 charts but I was pressed for time :). It's just a proof of concept.

I cached the authentication token on the server, to reduce the overall request calls and time, given we have to make 3 sepearate calls and induce a delay (for the time it takes for a job_id to complete) to retrieve the service report. I also cached the service report in the front end for about 15 minutes.

I also split my server into services and controllers (in this case there was no need for model and data access layer). This will make scaling and adding new/extending layers easier.

It was a bit tricky working with service reports that aren't implementing the status report API. I realize the data needs cleaning (accommodating/handling the uncomplaint service reports).

A live preview of all I've just talked about is accessible [here.](https://wsd-service-report.herokuapp.com/)