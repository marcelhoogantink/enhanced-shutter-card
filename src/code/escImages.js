import * as C from './constants.js';
import {xyPair} from './xyPair.js';
import {
  defImagePathOrColor,
  isUrl
} from './functions.js';

export class EscImages {
    #escImageInfo = {};
    #uniqueImages = new Set();   // unique srcs to load — Set handles deduplication automatically
    #dimensions = new Map();     // src → xyPair(width, height)
    #srcImageType = new Map();   // src → image_type, needed for fallback lookup on load error
    #resolvedSrc = new Map();    // original src → actual src to use
    constructor(shutterCfgs) {

        for (const imageType of C.IMAGE_TYPES) {
            let imageRefs = {};

            for (const shutterCfg of shutterCfgs) {

                let map = shutterCfg.imageMap();
                let image = shutterCfg.getImage(imageType);
                image = defImagePathOrColor(map, image);


                if (image) {
                    let src = image.replace(/([^:]\/)\/+/g, "/").trim();
                    // Set.add is a no-op for duplicates — no if/else needed
                    this.#uniqueImages.add(src);
                    // Only record the first image_type seen for this src (used for fallback)
                    if (!this.#srcImageType.has(src)) {
                        this.#srcImageType.set(src, imageType);
                    }
                    imageRefs[shutterCfg.id()] = { src };
                } else {
                    imageRefs[shutterCfg.id()] = { src: '' };
                }
            }

            this.#escImageInfo[imageType] = imageRefs;
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
    #getImageSrc(image_type, id) {
        let src = this.#escImageInfo[image_type][id]?.src ?? '';
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
    #getImageSize(image_type, id) {
        const src = this.#escImageInfo[image_type][id]?.src;
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
