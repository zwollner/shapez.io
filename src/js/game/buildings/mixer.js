import { formatItemsPerSecond } from "../../core/utils";
import { enumDirection, Vector } from "../../core/vector";
import { T } from "../../translations";
import { ItemAcceptorComponent } from "../components/item_acceptor";
import { ItemEjectorComponent } from "../components/item_ejector";
import { enumItemProcessorTypes, ItemProcessorComponent } from "../components/item_processor";
import { Entity } from "../entity";
import { defaultBuildingVariant, MetaBuilding } from "../meta_building";
import { GameRoot } from "../root";
import { enumHubGoalRewards } from "../tutorial_goals";

export const enumMixerVariants = { mirrored: "mirrored" };
export class MetaMixerBuilding extends MetaBuilding {
    constructor() {
        super("mixer");
    }

    getSilhouetteColor() {
        return "#cdbb7d";
    }

    /**
     * @param {string} variant
     */
    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumMixerVariants.mirrored:
                return new Vector(2, 1);
            default:
                assertAlways(false, "Unknown mixer variant: " + variant);
        }
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.mixer);
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumMixerVariants.mirrored];
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_mixer);
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 2,
                processorType: enumItemProcessorTypes.mixer,
            })
        );

        entity.addComponent(
            new ItemEjectorComponent({
                slots: [{ pos: new Vector(0, 0), direction: enumDirection.top }],
            })
        );
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: "color",
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                        filter: "color",
                    },
                ],
            })
        );
    }
    /**
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.bottom] },
                    { pos: new Vector(1, 0), directions: [enumDirection.bottom] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.mixer;
                break;
            }
            case enumMixerVariants.mirrored: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.bottom },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.top] },
                    { pos: new Vector(1, 0), directions: [enumDirection.top] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.mixer;
                break;
            }

            default:
                assertAlways(false, "Unknown mixer variant: " + variant);
        }
    }
}
