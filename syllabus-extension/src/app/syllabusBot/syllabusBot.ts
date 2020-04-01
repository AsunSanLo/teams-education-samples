import {
    TeamsActivityHandler,
    TurnContext,
    MessageFactory,
    MessagingExtensionAction,
    MessagingExtensionActionResponse,
    CardFactory
} from "botbuilder";

import * as Util from "util";

import * as debug from "debug";
const log = debug("msteams");

export class SyllabusBot extends TeamsActivityHandler {
    constructor() {
        super();
    }


    protected handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        const adaptiveCardSource: any = require("./syllabusSelectorCard.json");
        const adaptiveCard = CardFactory.adaptiveCard(adaptiveCardSource);
        console.log("hello!");
        let response: MessagingExtensionActionResponse = <MessagingExtensionActionResponse>{
            task: {
                type: "continue",
                value: {
                    card: adaptiveCard,
                    title: 'Comunicar temario',
                    height: 150,
                    width: 500
                }
            }
        };
        return Promise.resolve(response);
    }

    protected handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        switch (action.commandId) {
            case 'syllabusExpanderAction':
                const adaptiveCardSource: any = require("./syllabusDetailCard.json");
                const adaptiveCard = CardFactory.adaptiveCard(adaptiveCardSource);
                return Promise.resolve(<MessagingExtensionActionResponse>{
                    composeExtension: {
                        type: "result",
                        attachmentLayout: "list",
                        attachments: [adaptiveCard]
                    }
                });
                break;
            default:
                throw new Error('NotImplemented');
        }
    }
}