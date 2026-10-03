/**
 * Bathroom Tile Calculator
 * Handles all calculation logic
 */

const Calculator = {
    /**
     * Calculate number of floor tiles
     * @param {number} floorWidth - Floor width in mm
     * @param {number} floorLength - Floor length in mm
     * @param {number} floorTileWidth - Floor tile width in mm
     * @param {number} floorTileLength - Floor tile length in mm
     * @returns {number} Number of floor tiles needed
     */
    calculateFloorTiles(floorWidth, floorLength, floorTileWidth, floorTileLength) {
        // Calculate tiles needed in each direction
        const tilesWidth = Utils.roundUp(floorWidth / floorTileWidth);
        const tilesLength = Utils.roundUp(floorLength / floorTileLength);
        
        // Total tiles for floor
        return tilesWidth * tilesLength;
    },

    /**
     * Calculate number of wall tiles
     * @param {number} floorWidth - Floor width in mm
     * @param {number} floorLength - Floor length in mm
     * @param {number} wallHeight - Wall height in mm
     * @param {number} wallTileWidth - Wall tile width in mm
     * @param {number} wallTileHeight - Wall tile height in mm
     * @param {number} doorWidth - Door width in mm
     * @param {number} doorHeight - Door height in mm
     * @returns {number} Number of wall tiles needed
     */
    calculateWallTiles(floorWidth, floorLength, wallHeight, wallTileWidth, wallTileHeight, doorWidth, doorHeight) {
        // Calculate perimeter (4 walls)
        const perimeter = 2 * (floorWidth + floorLength);
        
        // Total wall area
        let totalWallArea = perimeter * wallHeight;
        
        // Subtract door area
        const doorArea = doorWidth * doorHeight;
        totalWallArea -= doorArea;
        
        // Calculate tile area
        const tileArea = wallTileWidth * wallTileHeight;
        
        // Calculate number of tiles
        const tilesNeeded = Utils.roundUp(totalWallArea / tileArea);
        
        return tilesNeeded;
    },

    /**
     * Calculate detailed metrics
     * @param {Object} params - Input parameters
     * @returns {Object} Detailed calculation results
     */
    calculateDetailed(params) {
        const {
            floorWidth,
            floorLength,
            floorTileWidth,
            floorTileLength,
            wallHeight,
            wallTileWidth,
            wallTileHeight,
            doorWidth,
            doorHeight,
            wastePercentage
        } = params;

        // Floor calculations
        const floorArea = Utils.calculateArea(floorWidth, floorLength);
        const floorTileArea = Utils.calculateArea(floorTileWidth, floorTileLength);
        const floorTilesWithoutWaste = Utils.roundUp(floorArea / floorTileArea);
        const floorTilesWithWaste = Utils.addWaste(floorTilesWithoutWaste, wastePercentage);

        // Wall calculations
        const perimeter = 2 * (floorWidth + floorLength);
        const grossWallArea = perimeter * wallHeight;
        const doorArea = Utils.calculateArea(doorWidth, doorHeight);
        const netWallArea = grossWallArea - doorArea;
        const wallTileArea = Utils.calculateArea(wallTileWidth, wallTileHeight);
        const wallTilesWithoutWaste = Utils.roundUp(netWallArea / wallTileArea);
        const wallTilesWithWaste = Utils.addWaste(wallTilesWithoutWaste, wastePercentage);

        // Waste calculations
        const wasteFloorTiles = floorTilesWithWaste - floorTilesWithoutWaste;
        const wasteWallTiles = wallTilesWithWaste - wallTilesWithoutWaste;
        const totalWasteTiles = wasteFloorTiles + wasteWallTiles;

        // Total calculations
        const totalTilesWithoutWaste = floorTilesWithoutWaste + wallTilesWithoutWaste;
        const totalTilesWithWaste = floorTilesWithWaste + wallTilesWithWaste;

        return {
            // Floor
            floorArea,
            floorTileArea,
            floorTilesWithoutWaste,
            floorTilesWithWaste,
            
            // Walls
            wallArea: netWallArea,
            wallTileArea,
            wallTilesWithoutWaste,
            wallTilesWithWaste,
            
            // Door
            doorArea,
            
            // Totals
            totalTilesWithoutWaste,
            totalTilesWithWaste,
            totalWasteTiles,
            
            // Additional metrics
            perimeter,
            grossWallArea,
            wastePercentage
        };
    },

    /**
     * Validate input parameters
     * @param {Object} params - Input parameters
     * @returns {Object} Validation result {isValid, errors}
     */
    validateInputs(params) {
        const errors = [];
        
        if (params.floorWidth <= 0) errors.push('Floor width must be greater than 0');
        if (params.floorLength <= 0) errors.push('Floor length must be greater than 0');
        if (params.floorTileWidth <= 0) errors.push('Floor tile width must be greater than 0');
        if (params.floorTileLength <= 0) errors.push('Floor tile length must be greater than 0');
        if (params.wallHeight <= 0) errors.push('Wall height must be greater than 0');
        if (params.wallTileWidth <= 0) errors.push('Wall tile width must be greater than 0');
        if (params.wallTileHeight <= 0) errors.push('Wall tile height must be greater than 0');
        if (params.doorWidth < 0) errors.push('Door width cannot be negative');
        if (params.doorHeight < 0) errors.push('Door height cannot be negative');
        if (params.doorWidth > params.floorWidth) errors.push('Door width cannot exceed floor width');
        if (params.doorHeight > params.wallHeight) errors.push('Door height cannot exceed wall height');
        if (params.wastePercentage < 0 || params.wastePercentage > 50) {
            errors.push('Waste percentage must be between 0 and 50');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }
};