import {
    TeamsActivityHandler,
    TurnContext,
    MessageFactory,
    MessagingExtensionAction,
    MessagingExtensionActionResponse,
    CardFactory,
    MessagingExtensionQuery,
    MessagingExtensionAttachment,
    MessagingExtensionResponse
} from "botbuilder";

import * as Util from "util";

import * as debug from "debug";
const log = debug("msteams");

export class SyllabusBot extends TeamsActivityHandler {
    constructor() {
        super();
    }

    protected handleTeamsMessagingExtensionQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResponse> {
        // get the search query
        let searchQuery = "";
        if (query && query.parameters && query.parameters[0].name === "searchKeyword" && query.parameters[0].value) {
            searchQuery = query.parameters[0].value.trim().toLowerCase();
        }

        let searchResultsCards: MessagingExtensionAttachment[] = [
            CardFactory.heroCard("Álgebra lineal", "Resolver problemas de Álgebra Lineal, mediante habilidades de cálculo básico y otras técnicas. Comunicar, tanto por escrito como de forma oral, conocimientos, procedimientos, resultados e ideas matemáticas."),
            CardFactory.heroCard("Álgebra de Boole","Resolver problemas de Cálculo Diferencial y aprender a comunicar, tanto por escrito como de forma oral, conocimientos, procedimientos y resultados matemáticos" ),
        ];

        let response: MessagingExtensionResponse = <MessagingExtensionResponse>{
            composeExtension: {
                type: "result",
                attachmentLayout: "list",
                attachments: searchResultsCards
            }
        };

        return Promise.resolve(response);
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