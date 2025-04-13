
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js';
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { HalftonePass } from 'three/addons/postprocessing/HalftonePass.js';
import { DotScreenShader } from 'three/addons/shaders/DotScreenShader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { ShaderPass }    from 'three/examples/jsm/postprocessing/ShaderPass.js';     
import { LuminosityShader }     from 'three/examples/jsm/shaders/LuminosityShader.js';
import { SobelOperatorShader }     from 'three/examples/jsm/shaders/SobelOperatorShader.js';
import { ColorifyShader } from 'three/examples/jsm/shaders/ColorifyShader.js';


const ThreeBackground = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;


        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 200;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        container.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 1.0));

        const directionalLight = new THREE.DirectionalLight(0xffffff, 15.5);
        directionalLight.position.set(0, 100, -180);

        scene.add(directionalLight);



        const pivotLookAt = new THREE.Group();
        const pivotSpin = new THREE.Group();

        pivotLookAt.add(pivotSpin);
        scene.add(pivotLookAt);


        let model;
        new FBXLoader().load('./movie reel.fbx', (object) => {
            pivotSpin.add(object);

            // object.add(new THREE.AxesHelper(500));
            model = object;
        });


        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -120);

        // window.addEventListener('mousemove', (e) => {
            // mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            // mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        // });

        const onMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', onMouseMove);

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', onWindowResize);

        // post processing effects
        const effectComposer = new EffectComposer(renderer);
        const renderPass = new RenderPass(scene, camera);

        effectComposer.addPass(renderPass);

        const luminosityPass = new ShaderPass(LuminosityShader);
        effectComposer.addPass(luminosityPass);

        const sobelPass = new ShaderPass(SobelOperatorShader);
        sobelPass.uniforms['resolution'].value.x = window.innerWidth * window.devicePixelRatio;
        sobelPass.uniforms['resolution'].value.y = window.innerHeight * window.devicePixelRatio;
        effectComposer.addPass(sobelPass);

        const colorifyPass = new ShaderPass(ColorifyShader);
        colorifyPass.uniforms['color'].value.set(0xCCCCCC); // Set desired tint color (e.g., red)
        effectComposer.addPass(colorifyPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            0.5,
            0.3,
            0.55
        );

        effectComposer.addPass(bloomPass);


        let frameId;
        function animate() {

            frameId = requestAnimationFrame(animate);

            raycaster.setFromCamera(mouse, camera);
            const target = new THREE.Vector3();
            raycaster.ray.intersectPlane(plane, target);

            if (model) {
                pivotLookAt.lookAt(target);

                pivotSpin.rotation.z -= 0.01;
            }

            // renderer.render(scene, camera);
            effectComposer.render();
        }

        animate();


        // 6. Cleanup
        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onWindowResize);

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };

    }, []);

    const style = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,           // behind other elements
    };

    return <div ref={containerRef} className="three-bg" style={style} />;
}

export default ThreeBackground;