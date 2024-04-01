import * as THREE from 'three';

class App {
    constructor() {
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGL1Renderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._setupCamera();
        this._setupLight();
        this._setupModel();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupCamera() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        const camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            100
        );
        camera.position.z = 25;
        this._camera = camera;
    }

    _setupLight() {
        const color = 0xffffff;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    _setupModel() {
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const sphereGeometry = new THREE.SphereGeometry(radius,
            widthSegments, heightSegments);

        const sunMaterial = new THREE.MeshPhongMaterial({
            emissive: 0xffff00, flatShading: true
        });

        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(3, 3, 3);
        solarSystem.add(sunMesh);

        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit);

        const earthMaterial = new THREE.MeshPhongMaterial({
            color: 0x2233ff, emissive: 0x112244, flatShading: true
        });

        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.position.x = 10;
        earthOrbit.add(earthMesh);

        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        const moonMatrial = new THREE.MeshPhongMaterial({
            color: 0x888888, emissive: 0x222222, flatShading: true
        });

        const moonMesh = new THREE.Mesh(sphereGeometry, moonMatrial);
        moonMesh.scale.set(0.5, 0.5, 0.5);
        moonOrbit.add(moonMesh);
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;

        const marsOrbit = new THREE.Object3D();
        this._solarSystem.add(marsOrbit);

        const marsMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000, emissive: 0x220000, flatShading: true
        });

        const marsMesh = new THREE.Mesh(sphereGeometry, marsMaterial);
        marsOrbit.position.x = 15;
        marsOrbit.add(marsMesh);
        this._marsOrbit = marsOrbit;
        this._marsRotationSpeed = 0.002; // 화성의 회전 속도
        this._setupMars();
    }

    _setupMars() {
        // 추가된 부분: 화성의 회전 속도
        this._marsRotationSpeed = 0.002; // 화성의 회전 속도
    }

    resize() {
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }

    render(time) {
        this._renderer.render(this._scene, this._camera);
        this.update(time);
        requestAnimationFrame(this.render.bind(this));
    }

    update(time) {
        time *= 0.01;
        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;

        // 추가된 부분: 화성의 자전 업데이트
        this._marsOrbit.rotation.y = time * this._marsRotationSpeed;
    }
}

window.onload = function () {
    new App();
};
