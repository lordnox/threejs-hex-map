define(["require", "exports", "three", "../../src/map-generator", "../../src/map-mesh", "../../src/util", "es6-promise"], function (require, exports, three_1, map_generator_1, map_mesh_1, util_1, es6_promise_1) {
    "use strict";
    var camera = new three_1.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    var scene = new three_1.Scene();
    var renderer = new THREE.WebGLRenderer({
        canvas: document.getElementsByTagName("canvas")[0],
        devicePixelRatio: window.devicePixelRatio
    });
    function onWindowResize(event) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function animate(timestamp) {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    if (renderer.extensions.get('ANGLE_instanced_arrays') === false) {
        document.getElementsByTagName("canvas")[0].style.display = "none";
        document.write("Your browser is not supported (missing extension ANGLE_instanced_arrays)");
    }
    else {
        window.addEventListener('resize', onWindowResize, false);
        renderer.setClearColor(0x6495ED);
        renderer.setSize(window.innerWidth, window.innerHeight);
        init();
        animate(0);
    }
    function init() {
        var zoom = (parseFloat(localStorage.getItem("zoom"))) || 25;
        camera.position.z = zoom;
        camera.rotation.x = Math.PI / 4.5;
        var textureAtlas = util_1.loadFile("land-atlas.json").then(function (json) { return JSON.parse(json); });
        var tiles = map_generator_1.generateRandomMap(96, function (q, r, h) {
            if (h < 0)
                return "water";
            if (h > 0.75)
                return "mountain";
            if (Math.random() > 0.5)
                return "grass";
            else
                return "plains";
        });
        es6_promise_1.Promise.all([textureAtlas, tiles]).then(function (_a) {
            var textureAtlas = _a[0], tiles = _a[1];
            var mesh = new map_mesh_1.default(tiles, textureAtlas);
            mesh.position.y = zoom * 0.95;
            scene.add(mesh);
        });
    }
});
