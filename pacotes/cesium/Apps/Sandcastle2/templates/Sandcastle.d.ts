type SelectOption = {
    text: string;
    value: string;
    onselect: () => void;
};
/**
 * Helpers for constructing UI inside a Sandcastle and interacting with the code editor
 */
declare const Sandcastle: {
    /**
     * Called on first load and every time the options set up by other helpers are changed.
     * No-op function by default, override with custom reset logic when needed
     */
    reset(): void;
    /**
     * Create a "bookmark" of sorts in the code that will be highlighted when run
     *
     * @param key
     */
    declare(key: any): void;
    /**
     * Highlight the given "bookmark" in the code
     *
     * @param key
     */
    highlight(key: any): void;
    /**
     * Signals to the page that Sandcastle has finished loading and calls the default
     * action if it has been set.
     * This is called automatically as part of the loading process, you should NOT need
     * to call this yourself.
     */
    finishedLoading(): void;
    /**
     * Create a toggle button with a checkbox
     *
     * @param text Button label
     * @param checked Default checked state
     * @param onchange Callback for when the button is clicked
     * @param toolbarId Element to append this to, defaults to the default toolbar
     */
    addToggleButton(text: string, checked: boolean, onchange: (newValue: boolean) => void, toolbarId?: string): void;
    /**
     * Create a button
     *
     * @param text Button label
     * @param onclick Callback for when the button is clicked
     * @param toolbarId Element to append this to, defaults to the default toolbar
     */
    addToolbarButton(text: string, onclick: () => void, toolbarId?: string): void;
    /**
     * Create a button and set the default action for this sandcastle to the click handler
     *
     * @param text Button label
     * @param onclick Callback for when the button is clicked
     * @param toolbarId Element to append this to, defaults to the default toolbar
     */
    addDefaultToolbarButton(text: string, onclick: () => void, toolbarId?: string): void;
    /**
     * Create a dropdown menu with the given options
     *
     * @param options Options in the select dropdown
     * @param toolbarId Element to append this to, defaults to the default toolbar
     */
    addToolbarMenu(options: SelectOption[], toolbarId?: string): void;
    /**
     * Create a dropdown menu with the given options and set the default action for this
     * sandcastle to the first item's selection handler
     *
     * @param options Options in the select dropdown
     * @param toolbarId Element to append this to, defaults to the default toolbar
     */
    addDefaultToolbarMenu(options: SelectOption[], toolbarId?: string): void;
};
export default Sandcastle;
