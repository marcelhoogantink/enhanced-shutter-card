import * as C from './constants.js';
import { html } from './lit/lit-core.min.js';

export class htmlCard{
  constructor(enhancedShutterCard){
    this.enhancedShutterCard=enhancedShutterCard;
  }
  defStyleVarsCard(){
    const card_vars = `
      --esc-card-flex-direction: ${this.enhancedShutterCard.getCardFlexDirection()};
    `;
    return card_vars;
  }
}

export class MessageManager {
  constructor() {
    this.messageGroup = {};
  }

  // Add a message with subject
  addMessage(text, type= 'warning',subject = 'General') {
    const message = new Message(text, type, subject);
    if (!this.messageGroup[subject]) {
      this.messageGroup[subject] = { messages: []};
    }
    this.messageGroup[subject].messages.push(message);
    if (type == 'warning' || type == 'error'){
      console.warn(`Enhanced Shutter Card (${subject}): "${message.text}"`);
//    }else{
//      console.info(`Enhanced Shutter Card (${subject}): "${message.text}"`);
//    }
      //debugger;
    }
  }

  // Display messages grouped by subject
  displayMessages() {
    let display= [];
    for (const subject in this.messageGroup) {
      const messages = this.messageGroup[subject].messages;

      if (messages.length > 0) {
        messages.forEach((message) => {
          //display.push (html`${message}`);
          display.push (message);
        });
      }
    }
    return html`${display.map(item => html`<ha-alert alert-type="${item.severity}">${item.text}</ha-alert>`)}`;
  }
  displayGroupMessages(subject) {
    let display= [];
    const messages = this.messageGroup[subject]?.messages ?? [];

    if (messages.length > 0) {
      messages.forEach((message) => {
          //display.push (html`${message}`);
          display.push (message);
      });
    }
    return html`${display.map(item => html`<ha-alert alert-type="${item.severity}">${item.text}</ha-alert>`)}`;
  }
  countMessages(){
    let counter=0;
    for (const subject in this.messageGroup) {
      counter += this.messageGroup[subject].messages.length;
    }
    return counter;
  }
}
export class Message {
  constructor(text, severity = C.HA_ALERT_INFO, subject = 'General') {
    this.text = text;
    this.severity = severity;
    this.subject = subject;
  }
}
