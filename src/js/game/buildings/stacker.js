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

export const enumStackerVariants = { mirrored: "mirrored" };
export class MetaStackerBuilding extends MetaBuilding {
    constructor() {
        super("stacker");
    }

    getSilhouetteColor() {
        return "#9fcd7d";
    }

    /**
     * @param {string} variant
     */
    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumStackerVariants.mirrored:
                return new Vector(2, 1);
            default:
                assertAlways(false, "Unknown stacker variant: " + variant);
        }
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(enumItemProcessorTypes.stacker);
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        return [defaultBuildingVariant, enumStackerVariants.mirrored];
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_stacker);
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 2,
                processorType: enumItemProcessorTypes.stacker,
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
                        filter: "shape",
                    },
                    {
                        pos: new Vector(1, 0),
                        directions: [enumDirection.bottom],
                        filter: "shape",
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
                entity.components.ItemProcessor.type = enumItemProcessorTypes.stacker;
                break;
            }
            case enumStackerVariants.mirrored: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.bottom },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.top] },
                    { pos: new Vector(1, 0), directions: [enumDirection.top] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.stacker;
                break;
            }

            default:
                assertAlways(false, "Unknown stacker variant: " + variant);
        }
    }
}
