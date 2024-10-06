import { App, ButtonComponent, PluginSettingTab, Setting } from "obsidian";
import { CLICKABLE_SELECTOR } from "./constants";
import Vimium from "./main";

export interface VimiumSettings {
	clickableCssSelector: string;
	markerSize: number;
	useBackspaceToHideMarkers: boolean;
	keysForHidingMarkers: Array<string>;
}

export const DEFAULT_SETTINGS: VimiumSettings = {
	clickableCssSelector: CLICKABLE_SELECTOR,
	markerSize: 12,
	useBackspaceToHideMarkers: false,
	keysForHidingMarkers: ['Escape'],
}

export class VimiumSettingTab extends PluginSettingTab {
	plugin: Vimium;

	constructor(app: App, plugin: Vimium) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName('Marker font size')
			.setDesc('The size of text in markers.')
			.addText(text => text
				.setValue(this.plugin.settings.markerSize.toString())
				.onChange(async (value) => {
					const num = parseInt(value);
					if (isNaN(num)) {
						this.plugin.settings.markerSize = DEFAULT_SETTINGS.markerSize;
					} else {
						this.plugin.settings.markerSize = num;
					}
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Clickable CSS selector')
			.setDesc('Used for selecting clickable HTML elements.')
			.addTextArea(text => text
				.setPlaceholder('CSS selector..')
				.setValue(this.plugin.settings.clickableCssSelector)
				.onChange(async (value) => {
					this.plugin.settings.clickableCssSelector = value;
					await this.plugin.saveSettings();
				}));

		new ButtonComponent(containerEl)
			.setButtonText("Reset")
			.setTooltip("Reset settings")
			.onClick(async () => {
				this.plugin.settings.clickableCssSelector = CLICKABLE_SELECTOR;
				await this.plugin.saveSettings();
				this.display();
			});

		new Setting(containerEl)
			.setName("Use backsapce to hide markers")
			.setDesc("When enabled, pressing backspace will hide markers when no input is in the buffer.")
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.useBackspaceToHideMarkers)
				.onChange(async (value) => {
					this.plugin.settings.useBackspaceToHideMarkers = value;
					if (value) {
						this.plugin.settings.keysForHidingMarkers.push('Backspace')
					}
					else {
						this.plugin.settings.keysForHidingMarkers.pop()
					}
					await this.plugin.saveSettings();
				}));

		new ButtonComponent(containerEl)
			.setButtonText("Reset")
			.setTooltip("Reset settings")
			.onClick(async () => {
				this.plugin.settings.useBackspaceToHideMarkers = DEFAULT_SETTINGS.useBackspaceToHideMarkers;
				this.plugin.settings.keysForHidingMarkers = DEFAULT_SETTINGS.keysForHidingMarkers;
				await this.plugin.saveSettings();
				this.display();
			});
	}
}
