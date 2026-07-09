import * as C from './constants.js';
import {xyPair} from './xyPair.js';
import {
  defImagePathOrColor,
  console_log,
  isUrl
} from './functions.js';
import {
  cfgNew,
} from './cfg.js';

export class EscImages {
    #escImageInfo = {};
    #uniqueImages = new Set();   // unique srcs to load — Set handles deduplication automatically
    #dimensions = new Map();     // src → xyPair(width, height)
    #srcImageType = new Map();   // src → image_type, needed for fallback lookup on load error
    #resolvedSrc = new Map();    // original src → actual src to use
    constructor(shutterCard) {

        if (shutterCard.newConfig) {
            // new (tree) config
            const cardObj = shutterCard.cardCfg;
            for (const imageType of C.IMAGE_TYPES) {
                let map = cardObj.imageMap();
                let imageRefs = {};
                for (const window of cardObj.cfg.windows) {
                    const windowObj = new cfgNew(shutterCard._hass,window);
                    let image = windowObj.getImage(imageType);
                    this.storeImage(image, map, imageRefs, C.WINDOWS_CONFIG,windowObj.id());
                    for (const cover of window.covers) {
                        const coverObj = new cfgNew(shutterCard._hass,cover);
                        let image = coverObj.getImage(imageType);
                        this.storeImage(image, map, imageRefs,C.COVERS_CONFIG, coverObj.id());
                        for (const entity of cover.entities) {
                            const entityObj = new cfgNew(shutterCard._hass,entity);
                            let image = entityObj.getImage(imageType);
                            this.storeImage(image, map, imageRefs, C.ENTITIES_CONFIG, entityObj.id());
                        }
                    }
                }
                this.#escImageInfo[imageType] = imageRefs;
            }
            //debugger; // new
        }else {
            // old just-entities config
            const shutterCfgs = shutterCard.shutterCfgs;
            for (const imageType of C.IMAGE_TYPES) {
                let imageRefs = {};

                for (const shutterCfg of shutterCfgs) {

                    let map = shutterCfg.imageMap();
                    let image = shutterCfg.getImage(imageType);
                    let configType;

                    if (imageType === C.CONFIG_WINDOW_IMAGE || imageType === C.CONFIG_VIEW_IMAGE) {
                        configType = C.WINDOWS_CONFIG;
                    } else if (imageType === C.CONFIG_SHUTTER_SLAT_IMAGE || imageType === C.CONFIG_SHUTTER_BOTTOM_IMAGE) {
                        configType = C.COVERS_CONFIG;
                    } else {
                        configType = C._NO_GROUP_CONFIG;
                    }
                    this.storeImage(image, map, imageRefs, configType,shutterCfg.id());
                }
                this.#escImageInfo[imageType] = imageRefs;
            }
            //debugger; // old
        }
    }

    storeImage(image, map,imageRefs,imageType,id){
        imageRefs[imageType] ??= {};
        image = defImagePathOrColor(map, image);
        if (image) {
            let src = image.replace(/([^:]\/)\/+/g, "/").trim();
            // Set.add is a no-op for duplicates — no if/else needed
            this.#uniqueImages.add(src);
            // Only record the first image_type seen for this src (used for fallback)
            if (!this.#srcImageType.has(src)) {
                this.#srcImageType.set(src, imageType);
            }
            imageRefs[imageType][id] = { src };
        } else {
            imageRefs[imageType][id] = { src: '' };
        }

    }
    // --- src getters ---

    getWindowImageSrc(id) {
        return this.#getImageSrc(C.CONFIG_WINDOW_IMAGE, id);
    }
    getViewImageSrc(id) {
        return this.#getImageSrc(C.CONFIG_VIEW_IMAGE, id);
    }
    getShutterSlatImageSrc(id) {
        return this.#getImageSrc(C.CONFIG_SHUTTER_SLAT_IMAGE, id);
    }
    getShutterBottomImageSrc(id) {
        return this.#getImageSrc(C.CONFIG_SHUTTER_BOTTOM_IMAGE, id);
    }
    #getImageSrc(imageType, id) {
        let configType;
        if (imageType === C.CONFIG_WINDOW_IMAGE || imageType === C.CONFIG_VIEW_IMAGE) {
            configType = C.WINDOWS_CONFIG;
        } else if (imageType === C.CONFIG_SHUTTER_SLAT_IMAGE || imageType === C.CONFIG_SHUTTER_BOTTOM_IMAGE) {
            configType = C.COVERS_CONFIG;
        } else {
            configType = C._NO_GROUP_CONFIG;
        }
        let src = this.#escImageInfo[imageType][configType]?.[id]?.src ?? '';
        src = this.#resolvedSrc.get(src) ?? src;
        return src;
    }

    // --- size getters ---

    getWindowImageSize(id) {
        return this.#getImageSize(C.CONFIG_WINDOW_IMAGE, id);
    }
    getViewImageSize(id) {
        return this.#getImageSize(C.CONFIG_VIEW_IMAGE, id);
    }
    getShutterSlatImageSize(id) {
        return this.#getImageSize(C.CONFIG_SHUTTER_SLAT_IMAGE, id);
    }
    getShutterBottomImageSize(id) {
        return this.#getImageSize(C.CONFIG_SHUTTER_BOTTOM_IMAGE, id);
    }
    #getImageSize(imageType, id) {
        let configType;
        if (imageType === C.CONFIG_WINDOW_IMAGE || imageType === C.CONFIG_VIEW_IMAGE) {
            configType = C.WINDOWS_CONFIG;
        } else if (imageType === C.CONFIG_SHUTTER_SLAT_IMAGE || imageType === C.CONFIG_SHUTTER_BOTTOM_IMAGE) {
            configType = C.COVERS_CONFIG;
        } else {
            configType = C._NO_GROUP_CONFIG;
        }
        const src = this.#escImageInfo[imageType][configType]?.[id]?.src;
        if (!src) return new xyPair(0, 0);
        return this.#dimensions.get(src) ?? new xyPair(0, 0);
    }

    // --- loading ---

    async processImages() {
        try {
            await this.#readImageDimensions();
        } catch (error) {
            console.error('Failed to load image dimensions:', error);
        }
        console_log(`EscImages: Loaded ${this.#dimensions.size} unique images with dimensions.`);
    }

    async #readImageDimensions() {
        const promises = [];

        for (const src of this.#uniqueImages) {
            if (!isUrl(src)) continue;

            const promise = new Promise((resolve) => {
                const img = new Image();

                img.onload = () => {
                    this.#dimensions.set(src, new xyPair(img.width, img.height));
                    this.#resolvedSrc.set(src, src); // original src is fine
                    resolve();
                };

                img.onerror = () => {
                    // Arrow function: `this` correctly refers to the EscImages instance
                    const imageType = this.#srcImageType.get(src);
                    const fallbackSrc = `${C.ESC_IMAGE_MAP}/${C.CONFIG_DEFAULT[imageType]}`;
                    console.warn(`Failed to load image: ${src}, using default: ${fallbackSrc}`);

                    const fallbackImg = new Image();

                    fallbackImg.onload = () => {
                        // Store fallback dimensions under the original src key
                        // so all existing references in #escImageInfo remain valid
                        this.#dimensions.set(src, new xyPair(fallbackImg.width, fallbackImg.height));
                        this.#resolvedSrc.set(src, fallbackSrc); // ← remap src
                        resolve();
                    };
                    fallbackImg.onerror = () => {
                        // Fallback also failed — store zero size and move on
                        // Never reject: we want Promise.all to load as much as possible
                        this.#dimensions.set(src, new xyPair(0, 0));
                        this.#resolvedSrc.set(src, fallbackSrc); // ← remap src
                    };
                    fallbackImg.src = fallbackSrc;
                };

                img.src = src;
            });

            promises.push(promise);
        }

        await Promise.all(promises);
    }
}
