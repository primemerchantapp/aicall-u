export class ToolManager {
    constructor() {
        this.tools = new Map();
        this.registerDefaultTools();
    }

    registerDefaultTools() {
        try {
            this.registerTool('googleSearch', new GoogleSearchTool());
            this.registerTool('weather', new WeatherTool());
            this.registerTool('scribe', new ScribeTool());
            Logger.info('All default tools registered successfully');
        } catch (error) {
            Logger.error('Error registering default tools', error);
        }
    }

    registerTool(name, toolInstance) {
        if (this.tools.has(name)) {
            throw new ApplicationError(`Tool ${name} is already registered`, ErrorCodes.INVALID_STATE);
        }
        this.tools.set(name, toolInstance);
        Logger.info(`Tool ${name} registered successfully`);
    }

    getToolDeclarations() {
        const allDeclarations = [];
        this.tools.forEach((tool, name) => {
            if (tool.getDeclaration) {
                allDeclarations.push({ [name]: tool.getDeclaration() });
            }
        });
        Logger.debug('Tool declarations retrieved', allDeclarations);
        return allDeclarations;
    }

    async handleToolCall(functionCall) {
        const { name, args, id } = functionCall;
        Logger.info(`Handling tool call: ${name}`, { args });

        const tool = this.tools.get(name);
        if (!tool) {
            Logger.error(`Unknown tool: ${name}`);
            throw new ApplicationError(`Unknown tool: ${name}`, ErrorCodes.INVALID_PARAMETER);
        }

        try {
            const result = await tool.execute(args);
            return {
                functionResponses: [{ response: { output: result }, id }],
            };
        } catch (error) {
            Logger.error(`Tool execution failed: ${name}`, error);
            return {
                functionResponses: [{ response: { error: error.message }, id }],
            };
        }
    }
}