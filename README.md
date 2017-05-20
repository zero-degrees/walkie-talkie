# Walkie Talkie

Responsive walkthroughs for your HTML5 applications.

## Installation

Install the dependency with Bower or whatever you prefer.

`bower install https://github.com/zero-degrees/walkie-talkie.git --save`

Include the files after jQuery.

```html
<link href="/bower_components/walkie-talkie/walkie-talkie.min.css" rel="stylesheet">
<script src="/bower_components/walkie-talkier/walkie-talkie.min.js"></script>
```

## Basic Usage

```javascript
$().walkieTalkie([
	{
		focus: 'div:eq(0)',		//optional jQuery selector to highlight an element
		message: 'This is the first slide.',		//the step's text
		callbacks: {
			next: function () {
				//This callback fires when the user goes to the next slide.
				//Perform setup/teardown here.
			}
		}
	}
	{
		focus: 'div:eq(1)',
		message: 'This is the last slide.',
		callbacks: {
			prev: function () {
				//This callback fires when the user goes to the previous slide.
				//Perform setup/teardown here.
			}
		}
	}
]);
```