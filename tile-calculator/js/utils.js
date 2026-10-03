/**
 * Utility functions for the tile calculator app
 */

const Utils = {
    /**
     * Convert millimeters to meters
     * @param {number} mm - Value in millimeters
     * @returns {number} Value in meters
     */
    mmToM(mm) {
        return mm / 1000;
    },

    /**
     * Convert square millimeters to square meters
     * @param {number} mmSq - Value in square millimeters
     * @returns {number} Value in square meters
     */
    mmSqToMSq(mmSq) {
        return mmSq / 1000000;
    },

    /**
     * Round to nearest integer
     * @param {number} value - Value to round
     * @returns {number} Rounded value
     */
    round(value) {
        return Math.round(value);
    },

    /**
     * Round up to nearest integer (ceiling)
     * @param {number} value - Value to round
     * @returns {number} Rounded up value
     */
    roundUp(value) {
        return Math.ceil(value);
    },

    /**
     * Calculate area in square millimeters
     * @param {number} width - Width in mm
     * @param {number} height - Height in mm
     * @returns {number} Area in mm²
     */
    calculateArea(width, height) {
        return width * height;
    },

    /**
     * Format number with thousand separators
     * @param {number} num - Number to format
     * @returns {string} Formatted number
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format area value for display
     * @param {number} areaMmSq - Area in square millimeters
     * @returns {string} Formatted area string
     */
    formatArea(areaMmSq) {
        const areaMSq = this.mmSqToMSq(areaMmSq);
        return areaMSq.toFixed(2) + ' m²';
    },

    /**
     * Parse form input to number
     * @param {string} value - Input value
     * @returns {number} Parsed number or 0
     */
    parseInput(value) {
        const parsed = parseFloat(value);
        return isNaN(parsed) ? 0 : parsed;
    },

    /**
     * Validate input range
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} True if valid
     */
    isValidRange(value, min, max) {
        return value >= min && value <= max;
    },

    /**
     * Calculate percentage
     * @param {number} value - Base value
     * @param {number} percentage - Percentage to calculate
     * @returns {number} Calculated value
     */
    calculatePercentage(value, percentage) {
        return (value * percentage) / 100;
    },

    /**
     * Add waste to tile count
     * @param {number} tileCount - Original tile count
     * @param {number} wastePercentage - Waste percentage
     * @returns {number} Tile count with waste
     */
    addWaste(tileCount, wastePercentage) {
        return this.roundUp(tileCount + this.calculatePercentage(tileCount, wastePercentage));
    }
};