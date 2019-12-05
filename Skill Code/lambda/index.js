// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');

const set = new Set();

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
			'LaunchRequest'
		);
	},
	handle(handlerInput) {
		const speakOutput =
			'Welcome to coolteam fourteen. What would you like to do?';
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

const GreetingIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'GreetingIntent'
		);
	},
	handle(handlerInput) {
		const speakOutput =
			'Hi, I am your grocery list. I can help you remember things for your next trip to the market. What would you like to do?';
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};

const AddItemIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'AddItemIntent'
		);
	},
	handle(handlerInput) {
		let speakOutput;
		let itemName =
			handlerInput.requestEnvelope.request.intent.slots.Item.value;
		if (itemName === 'undefined') {
			speakOutput = 'An item is required in order to add to your list.';
		} else {
			if (set.has(itemName)) {
				itemName = itemName[0].toUpperCase() + itemName.substring(1);
				speakOutput = `${itemName} is already on your grocery list`;
			} else {
				speakOutput = `Added ${itemName} to your grocery list.`;
				set.add(itemName);
			}
		}
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};

const RemoveItemIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'RemoveItemIntent'
		);
	},
	handle(handlerInput) {
		let speakOutput;
		let itemName =
			handlerInput.requestEnvelope.request.intent.slots.Item.value;
		if (itemName === 'undefined') {
			speakOutput = "You didn't specify which item you wanted to remove.";
		} else {
			if (!set.has(itemName)) {
				itemName = itemName[0].toUpperCase() + itemName.substring(1);
				speakOutput = `${itemName} was not found on your grocery list`;
			} else {
				speakOutput = `Removed ${itemName} from your grocery list.`;
				set.delete(itemName);
			}
		}
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};

const ViewListIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'ViewListIntent'
		);
	},
	handle(handlerInput) {
		let speakOutput;
		if (set.size === 0) speakOutput = 'Your list is empty.';
		else {
			let arr = [...set];
			let list = '';
			if (arr.length === 1) list = arr[0];
			else if (arr.length === 2) list = `${arr[0]} and ${arr[1]}`;
			else {
				list =
					arr.slice(0, arr.length - 1).join(', ') +
					', and ' +
					arr.slice(-1);
			}
			speakOutput = 'You have ' + list + ' on your list.';
		}
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};

const ClearListIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'ClearListIntent'
		);
	},
	handle(handlerInput) {
		let speakOutput;
		if (set.size === 0) speakOutput = 'Your grocery list is already empty.';
		else {
			set.clear();
			speakOutput = 'Okay, I removed all the items on your grocery list.';
		}
		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'AMAZON.HelpIntent'
		);
	},
	handle(handlerInput) {
		const speakOutput =
			'Try some commands such as add, view, or remove items from your list! What would you like to do?';

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt()
			.getResponse();
	},
};
const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
				'IntentRequest' &&
			(Alexa.getIntentName(handlerInput.requestEnvelope) ===
				'AMAZON.CancelIntent' ||
				Alexa.getIntentName(handlerInput.requestEnvelope) ===
					'AMAZON.StopIntent')
		);
	},
	handle(handlerInput) {
		const speakOutput = 'Goodbye!';
		return handlerInput.responseBuilder.speak(speakOutput).getResponse();
	},
};
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
			'SessionEndedRequest'
		);
	},
	handle(handlerInput) {
		// Any cleanup logic goes here.
		return handlerInput.responseBuilder.getResponse();
	},
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) ===
			'IntentRequest'
		);
	},
	handle(handlerInput) {
		const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
		const speakOutput = `You just triggered ${intentName}`;

		return (
			handlerInput.responseBuilder
				.speak(speakOutput)
				//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse()
		);
	},
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		console.log(`~~~~ Error handled: ${error.stack}`);
		const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		GreetingIntentHandler,
		HelpIntentHandler,
		AddItemIntentHandler,
		RemoveItemIntentHandler,
		ViewListIntentHandler,
		ClearListIntentHandler,
		CancelAndStopIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();
