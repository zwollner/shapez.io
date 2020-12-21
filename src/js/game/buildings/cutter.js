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

/** @enum {string} */
export const enumCutterVariants = { quad: "quad", mirrored: "mirrored", quad_mirrored: "quad-mirrored" };

export class MetaCutterBuilding extends MetaBuilding {
    constructor() {
        super("cutter");
    }

    getSilhouetteColor() {
        return "#7dcda2";
    }

    /**
     * @param {string} variant
     */
    getDimensions(variant) {
        switch (variant) {
            case defaultBuildingVariant:
            case enumCutterVariants.mirrored:
                return new Vector(2, 1);
            case enumCutterVariants.quad:
            case enumCutterVariants.quad_mirrored:
                return new Vector(4, 1);
            default:
                assertAlways(false, "Unknown cutter variant: " + variant);
        }
    }

    /**
     * @param {GameRoot} root
     * @param {string} variant
     * @returns {Array<[string, string]>}
     */
    getAdditionalStatistics(root, variant) {
        const speed = root.hubGoals.getProcessorBaseSpeed(
            variant === (enumCutterVariants.quad || enumCutterVariants.quad_mirrored)
                ? enumItemProcessorTypes.cutterQuad
                : enumItemProcessorTypes.cutter
        );
        return [[T.ingame.buildingPlacement.infoTexts.speed, formatItemsPerSecond(speed)]];
    }

    /**
     * @param {GameRoot} root
     */
    getAvailableVariants(root) {
        let variants = [defaultBuildingVariant, enumCutterVariants.mirrored];
        if (root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_quad)) {
            variants.push(enumCutterVariants.quad);
            variants.push(enumCutterVariants.quad_mirrored);
        }
        return variants;
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_cutter_and_trash);
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new ItemProcessorComponent({
                inputsPerCharge: 1,
                processorType: enumItemProcessorTypes.cutter,
            })
        );
        entity.addComponent(new ItemEjectorComponent({}));
        entity.addComponent(
            new ItemAcceptorComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        directions: [enumDirection.bottom],
                        filter: "shape",
                    },
                ],
            })
        );
    }

    /**
     *
     * @param {Entity} entity
     * @param {number} rotationVariant
     * @param {string} variant
     */
    updateVariants(entity, rotationVariant, variant) {
        switch (variant) {
            case defaultBuildingVariant: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.bottom] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.cutter;
                break;
            }
            case enumCutterVariants.mirrored: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.bottom },
                    { pos: new Vector(1, 0), direction: enumDirection.bottom },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.top] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.cutter;
                break;
            }
            case enumCutterVariants.quad: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.top },
                    { pos: new Vector(1, 0), direction: enumDirection.top },
                    { pos: new Vector(2, 0), direction: enumDirection.top },
                    { pos: new Vector(3, 0), direction: enumDirection.top },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.bottom] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.cutterQuad;
                break;
            }
            case enumCutterVariants.quad_mirrored: {
                entity.components.ItemEjector.setSlots([
                    { pos: new Vector(0, 0), direction: enumDirection.bottom },
                    { pos: new Vector(1, 0), direction: enumDirection.bottom },
                    { pos: new Vector(2, 0), direction: enumDirection.bottom },
                    { pos: new Vector(3, 0), direction: enumDirection.bottom },
                ]);
                entity.components.ItemAcceptor.setSlots([
                    { pos: new Vector(0, 0), directions: [enumDirection.top] },
                ]);
                entity.components.ItemProcessor.type = enumItemProcessorTypes.cutterQuad;
                break;
            }

            default:
                assertAlways(false, "Unknown painter variant: " + variant);
        }
    }
}
