/**
 * Main App Controller
 * Coordinates between calculator, visualizer, and UI
 */

const App = {
    // DOM elements cache
    elements: {},

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.performInitialCalculation();
    },

    /**
     * Cache frequently used DOM elements
     */
    cacheElements() {
        this.elements.form = document.getElementById('calculatorForm');
        this.elements.resultsSection = document.getElementById('resultsSection');
        this.elements.visualizationSection = document.getElementById('visualizationSection');

        // Input fields
        this.elements.floorWidth = document.getElementById('floorWidth');
        this.elements.floorLength = document.getElementById('floorLength');
        this.elements.floorTileWidth = document.getElementById('floorTileWidth');
        this.elements.floorTileLength = document.getElementById('floorTileLength');
        this.elements.wallHeight = document.getElementById('wallHeight');
        this.elements.wallTileWidth = document.getElementById('wallTileWidth');
        this.elements.wallTileHeight = document.getElementById('wallTileHeight');
        this.elements.doorWidth = document.getElementById('doorWidth');
        this.elements.doorHeight = document.getElementById('doorHeight');
        this.elements.wastePercentage = document.getElementById('wastePercentage');

        // Result fields
        this.elements.floorTilesWithoutWaste = document.getElementById('floorTilesWithoutWaste');
        this.elements.floorTilesWithWaste = document.getElementById('floorTilesWithWaste');
        this.elements.wallTilesWithoutWaste = document.getElementById('wallTilesWithoutWaste');
        this.elements.wallTilesWithWaste = document.getElementById('wallTilesWithWaste');
        this.elements.totalTilesWithoutWaste = document.getElementById('totalTilesWithoutWaste');
        this.elements.totalTilesWithWaste = document.getElementById('totalTilesWithWaste');

        // Detail fields
        this.elements.floorArea = document.getElementById('floorArea');
        this.elements.wallArea = document.getElementById('wallArea');
        this.elements.doorArea = document.getElementById('doorArea');
        this.elements.floorTileArea = document.getElementById('floorTileArea');
        this.elements.wallTileArea = document.getElementById('wallTileArea');
        this.elements.wasteTilesAdded = document.getElementById('wasteTilesAdded');
    },

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Form submission and input changes
        this.elements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Real-time calculation on input changes
        const inputs = this.elements.form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.performCalculation());
            input.addEventListener('input', () => this.performCalculation());
        });
    },

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();
        this.performCalculation();
    },

    /**
     * Perform initial calculation with default values
     */
    performInitialCalculation() {
        this.performCalculation();
    },

    /**
     * Perform the tile calculation
     */
    performCalculation() {
        // Gather input values
        const params = this.gatherInputs();

        // Validate inputs
        const validation = Calculator.validateInputs(params);
        if (!validation.isValid) {
            console.warn('Validation errors:', validation.errors);
            return;
        }

        // Perform calculation
        const results = Calculator.calculateDetailed(params);

        // Update UI
        this.updateResults(results);
        this.updateVisualizations(params, results);

        // Show sections
        this.elements.resultsSection.style.display = 'block';
        this.elements.visualizationSection.style.display = 'block';
    },

    /**
     * Gather input values from form
     */
    gatherInputs() {
        return {
            floorWidth: Utils.parseInput(this.elements.floorWidth.value),
            floorLength: Utils.parseInput(this.elements.floorLength.value),
            floorTileWidth: Utils.parseInput(this.elements.floorTileWidth.value),
            floorTileLength: Utils.parseInput(this.elements.floorTileLength.value),
            wallHeight: Utils.parseInput(this.elements.wallHeight.value),
            wallTileWidth: Utils.parseInput(this.elements.wallTileWidth.value),
            wallTileHeight: Utils.parseInput(this.elements.wallTileHeight.value),
            doorWidth: Utils.parseInput(this.elements.doorWidth.value),
            doorHeight: Utils.parseInput(this.elements.doorHeight.value),
            wastePercentage: Utils.parseInput(this.elements.wastePercentage.value)
        };
    },

    /**
     * Update results display
     */
    updateResults(results) {
        // Floor tiles
        this.elements.floorTilesWithoutWaste.textContent = Utils.formatNumber(results.floorTilesWithoutWaste);
        this.elements.floorTilesWithWaste.textContent = Utils.formatNumber(results.floorTilesWithWaste);

        // Wall tiles
        this.elements.wallTilesWithoutWaste.textContent = Utils.formatNumber(results.wallTilesWithoutWaste);
        this.elements.wallTilesWithWaste.textContent = Utils.formatNumber(results.wallTilesWithWaste);

        // Total tiles
        this.elements.totalTilesWithoutWaste.textContent = Utils.formatNumber(results.totalTilesWithoutWaste);
        this.elements.totalTilesWithWaste.textContent = Utils.formatNumber(results.totalTilesWithWaste);

        // Details
        this.elements.floorArea.textContent = Utils.formatArea(results.floorArea);
        this.elements.wallArea.textContent = Utils.formatArea(results.wallArea);
        this.elements.doorArea.textContent = Utils.formatArea(results.doorArea);
        this.elements.floorTileArea.textContent = Utils.formatArea(results.floorTileArea);
        this.elements.wallTileArea.textContent = Utils.formatArea(results.wallTileArea);
        this.elements.wasteTilesAdded.textContent = Utils.formatNumber(results.totalWasteTiles);
    },

    /**
     * Update visualizations
     */
    updateVisualizations(params, results) {
        Visualizer.renderAll(params, results);
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}