/**
 * Bathroom Tile Visualizer
 * Handles canvas drawing and visualization
 */

const Visualizer = {
    // Configuration
    config: {
        tileColor: '#3498db',
        tileBorderColor: '#2c3e50',
        tileBorderWidth: 2,
        doorColor: '#e74c3c',
        doorBorderColor: '#c0392b',
        backgroundColor: '#ecf0f1',
        gridColor: '#bdc3c7',
        scale: 0.15 // Scale for drawing (mm to pixels)
    },

    /**
     * Draw floor plan on canvas
     * @param {string} canvasId - Canvas element ID
     * @param {number} floorWidth - Floor width in mm
     * @param {number} floorLength - Floor length in mm
     * @param {number} floorTileWidth - Floor tile width in mm
     * @param {number} floorTileLength - Floor tile length in mm
     */
    drawFloorPlan(canvasId, floorWidth, floorLength, floorTileWidth, floorTileLength) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const padding = 40;
        const scale = this.config.scale;

        // Calculate scaled dimensions
        const scaledWidth = floorWidth * scale;
        const scaledLength = floorLength * scale;
        const scaledTileWidth = floorTileWidth * scale;
        const scaledTileLength = floorTileLength * scale;

        // Calculate starting position to center the floor
        const startX = (canvas.width - scaledWidth) / 2;
        const startY = (canvas.height - scaledLength) / 2;

        // Clear canvas
        ctx.fillStyle = this.config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw floor outline
        ctx.strokeStyle = this.config.tileBorderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, scaledWidth, scaledLength);

        // Draw tiles
        const tilesX = Math.ceil(floorWidth / floorTileWidth);
        const tilesY = Math.ceil(floorLength / floorTileLength);

        for (let i = 0; i < tilesX; i++) {
            for (let j = 0; j < tilesY; j++) {
                const tileX = startX + i * scaledTileWidth;
                const tileY = startY + j * scaledTileLength;

                // Draw tile
                ctx.fillStyle = this.config.tileColor;
                ctx.fillRect(tileX, tileY, scaledTileWidth, scaledTileLength);

                // Draw tile border
                ctx.strokeStyle = this.config.tileBorderColor;
                ctx.lineWidth = this.config.tileBorderWidth;
                ctx.strokeRect(tileX, tileY, scaledTileWidth, scaledTileLength);
            }
        }

        // Draw dimensions
        this.drawDimension(ctx, startX, startY + scaledLength + 20, startX + scaledWidth, startY + scaledLength + 20, 
                          `${(floorWidth / 1000).toFixed(1)}m`);
        this.drawDimension(ctx, startX - 20, startY, startX - 20, startY + scaledLength, 
                          `${(floorLength / 1000).toFixed(1)}m`);
    },

    /**
     * Draw wall elevation on canvas
     * @param {string} canvasId - Canvas element ID
     * @param {number} wallWidth - Wall width in mm
     * @param {number} wallHeight - Wall height in mm
     * @param {number} wallTileWidth - Wall tile width in mm
     * @param {number} wallTileHeight - Wall tile height in mm
     * @param {number} doorWidth - Door width in mm (0 if not on this wall)
     * @param {number} doorHeight - Door height in mm
     */
    drawWallElevation(canvasId, wallWidth, wallHeight, wallTileWidth, wallTileHeight, doorWidth = 0, doorHeight = 0) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const scale = 0.08; // Smaller scale for walls

        // Calculate scaled dimensions
        const scaledWidth = wallWidth * scale;
        const scaledHeight = wallHeight * scale;
        const scaledTileWidth = wallTileWidth * scale;
        const scaledTileHeight = wallTileHeight * scale;
        const scaledDoorWidth = doorWidth * scale;
        const scaledDoorHeight = doorHeight * scale;

        // Calculate starting position
        const startX = (canvas.width - scaledWidth) / 2;
        const startY = (canvas.height - scaledHeight) / 2;

        // Clear canvas
        ctx.fillStyle = this.config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw wall outline
        ctx.strokeStyle = this.config.tileBorderColor;
        ctx.lineWidth = 3;
        ctx.strokeRect(startX, startY, scaledWidth, scaledHeight);

        // Draw tiles
        const tilesX = Math.ceil(wallWidth / wallTileWidth);
        const tilesY = Math.ceil(wallHeight / wallTileHeight);

        for (let i = 0; i < tilesX; i++) {
            for (let j = 0; j < tilesY; j++) {
                const tileX = startX + i * scaledTileWidth;
                const tileY = startY + j * scaledTileHeight;

                // Skip if this tile overlaps with door
                if (doorWidth > 0 && this.tileOverlapsDoor(tileX, tileY, scaledTileWidth, scaledTileHeight, 
                    startX + (wallWidth - doorWidth) / 2 * scale, startY + scaledHeight - scaledDoorHeight, 
                    scaledDoorWidth, scaledDoorHeight)) {
                    continue;
                }

                // Draw tile
                ctx.fillStyle = this.config.tileColor;
                ctx.fillRect(tileX, tileY, scaledTileWidth, scaledTileHeight);

                // Draw tile border
                ctx.strokeStyle = this.config.tileBorderColor;
                ctx.lineWidth = this.config.tileBorderWidth;
                ctx.strokeRect(tileX, tileY, scaledTileWidth, scaledTileHeight);
            }
        }

        // Draw door if present
        if (doorWidth > 0) {
            const doorX = startX + (wallWidth - doorWidth) / 2 * scale;
            const doorY = startY + scaledHeight - scaledDoorHeight;

            ctx.fillStyle = this.config.doorColor;
            ctx.fillRect(doorX, doorY, scaledDoorWidth, scaledDoorHeight);

            ctx.strokeStyle = this.config.doorBorderColor;
            ctx.lineWidth = 2;
            ctx.strokeRect(doorX, doorY, scaledDoorWidth, scaledDoorHeight);

            // Draw door label
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('DOOR', doorX + scaledDoorWidth / 2, doorY + scaledDoorHeight / 2);
        }

        // Draw dimensions
        this.drawDimension(ctx, startX, startY + scaledHeight + 20, startX + scaledWidth, startY + scaledHeight + 20, 
                          `${(wallWidth / 1000).toFixed(1)}m`);
        this.drawDimension(ctx, startX - 20, startY, startX - 20, startY + scaledHeight, 
                          `${(wallHeight / 1000).toFixed(1)}m`);
    },

    /**
     * Check if tile overlaps with door area
     * @private
     */
    tileOverlapsDoor(tileX, tileY, tileW, tileH, doorX, doorY, doorW, doorH) {
        return !(tileX + tileW < doorX || tileX > doorX + doorW || 
                 tileY + tileH < doorY || tileY > doorY + doorH);
    },

    /**
     * Draw dimension line with label
     * @private
     */
    drawDimension(ctx, x1, y1, x2, y2, label) {
        // Draw line
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Draw label
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const labelX = (x1 + x2) / 2;
        const labelY = (y1 + y2) / 2 - 10;
        ctx.fillText(label, labelX, labelY);
    },

    /**
     * Render all visualizations
     * @param {Object} params - Input parameters
     * @param {Object} results - Calculation results
     */
    renderAll(params, results) {
        const {
            floorWidth,
            floorLength,
            floorTileWidth,
            floorTileLength,
            wallHeight,
            wallTileWidth,
            wallTileHeight,
            doorWidth,
            doorHeight
        } = params;

        // Draw floor plan
        this.drawFloorPlan('floorCanvas', floorWidth, floorLength, floorTileWidth, floorTileLength);

        // Draw wall 1 (width side - with door)
        this.drawWallElevation('wall1Canvas', floorWidth, wallHeight, wallTileWidth, wallTileHeight, doorWidth, doorHeight);

        // Draw wall 2 (length side - no door)
        this.drawWallElevation('wall2Canvas', floorLength, wallHeight, wallTileWidth, wallTileHeight, 0, 0);

        // Draw wall 3 (width side - no door)
        this.drawWallElevation('wall3Canvas', floorWidth, wallHeight, wallTileWidth, wallTileHeight, 0, 0);

        // Draw wall 4 (length side - no door)
        this.drawWallElevation('wall4Canvas', floorLength, wallHeight, wallTileWidth, wallTileHeight, 0, 0);
    }
};