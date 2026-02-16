import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const SHAPE_COLORS = {
  cube: 0xf59e0b,
  rectangular: 0x3b82f6,
  sphere: 0x10b981,
  cylinder: 0x8b5cf6,
  cone: 0xf43f5e,
  pyramid: 0xf97316,
  triangularPrism: 0x06b6d4,
  // 2D shapes
  triangle: 0xe83e8c,
  rectangle: 0x17a2b8,
  square: 0x6366f1,
  circle: 0xffc107,
  trapezoid: 0x6610f2,
  rhombus: 0x10b981,
  rhomboid: 0xf97316,
  pentagon: 0x6f42c1,
  hexagon: 0x14b8a6,
};

function createLabel(text) {
  const div = document.createElement('div');
  div.textContent = text;
  div.style.cssText = 'background:rgba(0,0,0,0.7);color:#fff;padding:2px 6px;border-radius:4px;font-size:11px;font-family:monospace;pointer-events:none;white-space:nowrap;';
  return new CSS2DObject(div);
}

function createDimensionLine(scene, start, end, label) {
  const points = [start, end];
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 1 });
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const lbl = createLabel(label);
  lbl.position.copy(mid);
  scene.add(lbl);

  return [line, lbl];
}

function buildShapeMesh(shapeType, params) {
  const group = new THREE.Group();
  const color = SHAPE_COLORS[shapeType] || 0x888888;
  const mat = new THREE.MeshPhongMaterial({
    color,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide,
  });
  const edgeMat = new THREE.LineBasicMaterial({ color: 0x333333 });

  let geometry;
  const labels = [];

  const scaleFactor = 0.5;

  switch (shapeType) {
    case 'cube': {
      const a = params.a * scaleFactor;
      geometry = new THREE.BoxGeometry(a, a, a);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.y = a / 2;
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      edges.position.y = a / 2;
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-a / 2, 0, a / 2 + 0.2),
        new THREE.Vector3(a / 2, 0, a / 2 + 0.2),
        `a=${params.a}`
      ));
      break;
    }
    case 'rectangular': {
      const a = params.a * scaleFactor;
      const b = params.b * scaleFactor;
      const c = params.c * scaleFactor;
      geometry = new THREE.BoxGeometry(a, c, b);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.y = c / 2;
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      edges.position.y = c / 2;
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-a / 2, 0, b / 2 + 0.2),
        new THREE.Vector3(a / 2, 0, b / 2 + 0.2),
        `a=${params.a}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(a / 2 + 0.2, 0, -b / 2),
        new THREE.Vector3(a / 2 + 0.2, 0, b / 2),
        `b=${params.b}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(a / 2 + 0.2, 0, b / 2 + 0.2),
        new THREE.Vector3(a / 2 + 0.2, c, b / 2 + 0.2),
        `c=${params.c}`
      ));
      break;
    }
    case 'sphere': {
      const r = params.r * scaleFactor;
      geometry = new THREE.SphereGeometry(r, 32, 24);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.y = r;
      group.add(mesh);
      const wireGeo = new THREE.SphereGeometry(r, 16, 12);
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(wireGeo), new THREE.LineBasicMaterial({ color: 0x333333, opacity: 0.15, transparent: true }));
      wire.position.y = r;
      group.add(wire);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, r, 0),
        new THREE.Vector3(r, r, 0),
        `r=${params.r}`
      ));
      break;
    }
    case 'cylinder': {
      const r = params.r * scaleFactor;
      const h = params.h * scaleFactor;
      geometry = new THREE.CylinderGeometry(r, r, h, 32);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.y = h / 2;
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      edges.position.y = h / 2;
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(r, 0, 0),
        `r=${params.r}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(r + 0.2, 0, 0),
        new THREE.Vector3(r + 0.2, h, 0),
        `h=${params.h}`
      ));
      break;
    }
    case 'cone': {
      const r = params.r * scaleFactor;
      const h = params.h * scaleFactor;
      geometry = new THREE.ConeGeometry(r, h, 32);
      const mesh = new THREE.Mesh(geometry, mat);
      mesh.position.y = h / 2;
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      edges.position.y = h / 2;
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(r, 0, 0),
        `r=${params.r}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(r + 0.2, 0, 0),
        new THREE.Vector3(r + 0.2, h, 0),
        `h=${params.h}`
      ));
      break;
    }
    case 'pyramid': {
      const a = params.a * scaleFactor;
      const h = params.h * scaleFactor;
      const halfA = a / 2;
      const vertices = new Float32Array([
        0, h, 0,
        -halfA, 0, -halfA,
        halfA, 0, -halfA,
        halfA, 0, halfA,
        -halfA, 0, halfA,
      ]);
      const indices = [
        0, 1, 2,
        0, 2, 3,
        0, 3, 4,
        0, 4, 1,
        1, 3, 2,
        1, 4, 3,
      ];
      geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
      geometry.setIndex(indices);
      geometry.computeVertexNormals();
      const mesh = new THREE.Mesh(geometry, mat);
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-halfA, 0, halfA + 0.2),
        new THREE.Vector3(halfA, 0, halfA + 0.2),
        `a=${params.a}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(halfA + 0.2, 0, halfA + 0.2),
        new THREE.Vector3(halfA + 0.2, h, halfA + 0.2),
        `h=${params.h}`
      ));
      break;
    }
    case 'triangularPrism': {
      const a = params.a * scaleFactor;
      const h = params.h * scaleFactor;
      const triH = (a * Math.sqrt(3)) / 2;
      const shape = new THREE.Shape();
      shape.moveTo(-a / 2, 0);
      shape.lineTo(a / 2, 0);
      shape.lineTo(0, triH);
      shape.closePath();
      const extrudeSettings = { depth: h, bevelEnabled: false };
      geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      geometry.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(geometry, mat);
      group.add(mesh);
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geometry), edgeMat);
      group.add(edges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-a / 2, 0, 0.2),
        new THREE.Vector3(a / 2, 0, 0.2),
        `a=${params.a}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(a / 2 + 0.2, 0, 0),
        new THREE.Vector3(a / 2 + 0.2, 0, -h),
        `h=${params.h}`
      ));
      break;
    }
    // --- 2D Shapes (flat on ground plane) ---
    case 'triangle': {
      const b = params.b * scaleFactor;
      const h = params.h * scaleFactor;
      const triShape = new THREE.Shape();
      triShape.moveTo(-b / 2, 0);
      triShape.lineTo(b / 2, 0);
      triShape.lineTo(0, h);
      triShape.closePath();
      geometry = new THREE.ShapeGeometry(triShape);
      const triMesh = new THREE.Mesh(geometry, mat);
      triMesh.rotation.x = -Math.PI / 2;
      group.add(triMesh);
      const triEdgeGeo = new THREE.EdgesGeometry(geometry);
      const triEdges = new THREE.LineSegments(triEdgeGeo, edgeMat);
      triEdges.rotation.x = -Math.PI / 2;
      group.add(triEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-b / 2, 0, 0),
        new THREE.Vector3(b / 2, 0, 0),
        `b=${params.b}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -h),
        `h=${params.h}`
      ));
      break;
    }
    case 'rectangle': {
      const a = params.a * scaleFactor;
      const b = params.b * scaleFactor;
      geometry = new THREE.PlaneGeometry(a, b);
      const rectMesh = new THREE.Mesh(geometry, mat);
      rectMesh.rotation.x = -Math.PI / 2;
      group.add(rectMesh);
      const rectEdgeGeo = new THREE.EdgesGeometry(geometry);
      const rectEdges = new THREE.LineSegments(rectEdgeGeo, edgeMat);
      rectEdges.rotation.x = -Math.PI / 2;
      group.add(rectEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-a / 2, 0, b / 2 + 0.15),
        new THREE.Vector3(a / 2, 0, b / 2 + 0.15),
        `a=${params.a}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(a / 2 + 0.15, 0, -b / 2),
        new THREE.Vector3(a / 2 + 0.15, 0, b / 2),
        `b=${params.b}`
      ));
      break;
    }
    case 'square': {
      const a = params.a * scaleFactor;
      geometry = new THREE.PlaneGeometry(a, a);
      const sqMesh = new THREE.Mesh(geometry, mat);
      sqMesh.rotation.x = -Math.PI / 2;
      group.add(sqMesh);
      const sqEdgeGeo = new THREE.EdgesGeometry(geometry);
      const sqEdges = new THREE.LineSegments(sqEdgeGeo, edgeMat);
      sqEdges.rotation.x = -Math.PI / 2;
      group.add(sqEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-a / 2, 0, a / 2 + 0.15),
        new THREE.Vector3(a / 2, 0, a / 2 + 0.15),
        `a=${params.a}`
      ));
      break;
    }
    case 'circle': {
      const r = params.r * scaleFactor;
      geometry = new THREE.CircleGeometry(r, 64);
      const circleMesh = new THREE.Mesh(geometry, mat);
      circleMesh.rotation.x = -Math.PI / 2;
      group.add(circleMesh);
      const circleEdgeGeo = new THREE.EdgesGeometry(geometry);
      const circleEdges = new THREE.LineSegments(circleEdgeGeo, edgeMat);
      circleEdges.rotation.x = -Math.PI / 2;
      group.add(circleEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, 0.01, 0),
        new THREE.Vector3(r, 0.01, 0),
        `r=${params.r}`
      ));
      break;
    }
    case 'trapezoid': {
      const A = params.a * scaleFactor;
      const B = params.b * scaleFactor;
      const h = params.h * scaleFactor;
      const trapShape = new THREE.Shape();
      trapShape.moveTo(-A / 2, 0);
      trapShape.lineTo(A / 2, 0);
      trapShape.lineTo(B / 2, h);
      trapShape.lineTo(-B / 2, h);
      trapShape.closePath();
      geometry = new THREE.ShapeGeometry(trapShape);
      const trapMesh = new THREE.Mesh(geometry, mat);
      trapMesh.rotation.x = -Math.PI / 2;
      group.add(trapMesh);
      const trapEdgeGeo = new THREE.EdgesGeometry(geometry);
      const trapEdges = new THREE.LineSegments(trapEdgeGeo, edgeMat);
      trapEdges.rotation.x = -Math.PI / 2;
      group.add(trapEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-A / 2, 0, 0.15),
        new THREE.Vector3(A / 2, 0, 0.15),
        `a=${params.a}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-B / 2, 0, -h - 0.15),
        new THREE.Vector3(B / 2, 0, -h - 0.15),
        `b=${params.b}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-A / 2 - 0.15, 0, 0),
        new THREE.Vector3(-A / 2 - 0.15, 0, -h),
        `h=${params.h}`
      ));
      break;
    }
    case 'rhombus': {
      const D = params.D * scaleFactor;
      const d = params.d * scaleFactor;
      const rhoShape = new THREE.Shape();
      rhoShape.moveTo(0, d / 2);
      rhoShape.lineTo(D / 2, 0);
      rhoShape.lineTo(0, -d / 2);
      rhoShape.lineTo(-D / 2, 0);
      rhoShape.closePath();
      geometry = new THREE.ShapeGeometry(rhoShape);
      const rhoMesh = new THREE.Mesh(geometry, mat);
      rhoMesh.rotation.x = -Math.PI / 2;
      group.add(rhoMesh);
      const rhoEdgeGeo = new THREE.EdgesGeometry(geometry);
      const rhoEdges = new THREE.LineSegments(rhoEdgeGeo, edgeMat);
      rhoEdges.rotation.x = -Math.PI / 2;
      group.add(rhoEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-D / 2, 0.01, 0),
        new THREE.Vector3(D / 2, 0.01, 0),
        `D=${params.D}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(0, 0.01, -d / 2),
        new THREE.Vector3(0, 0.01, d / 2),
        `d=${params.d}`
      ));
      break;
    }
    case 'rhomboid': {
      const b = params.b * scaleFactor;
      const h = params.h * scaleFactor;
      const angleRad = (params.ang || 60) * Math.PI / 180;
      const xOff = h / Math.tan(angleRad);
      const rhdShape = new THREE.Shape();
      rhdShape.moveTo(0, 0);
      rhdShape.lineTo(b, 0);
      rhdShape.lineTo(b + xOff, h);
      rhdShape.lineTo(xOff, h);
      rhdShape.closePath();
      geometry = new THREE.ShapeGeometry(rhdShape);
      // Center it
      geometry.computeBoundingBox();
      const cx = (geometry.boundingBox.min.x + geometry.boundingBox.max.x) / 2;
      const cy = (geometry.boundingBox.min.y + geometry.boundingBox.max.y) / 2;
      geometry.translate(-cx, -cy, 0);
      const rhdMesh = new THREE.Mesh(geometry, mat);
      rhdMesh.rotation.x = -Math.PI / 2;
      group.add(rhdMesh);
      const rhdEdgeGeo = new THREE.EdgesGeometry(geometry);
      const rhdEdges = new THREE.LineSegments(rhdEdgeGeo, edgeMat);
      rhdEdges.rotation.x = -Math.PI / 2;
      group.add(rhdEdges);
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(-cx, 0, cy + 0.15),
        new THREE.Vector3(b - cx, 0, cy + 0.15),
        `b=${params.b}`
      ));
      labels.push(...createDimensionLine(group,
        new THREE.Vector3(xOff - cx - 0.15, 0, cy),
        new THREE.Vector3(xOff - cx - 0.15, 0, cy - h),
        `h=${params.h}`
      ));
      break;
    }
    case 'pentagon':
    case 'hexagon': {
      const n = shapeType === 'pentagon' ? 5 : 6;
      const a = params.a * scaleFactor;
      const radius = a / (2 * Math.sin(Math.PI / n));
      const polyShape = new THREE.Shape();
      for (let i = 0; i < n; i++) {
        const angle = (i / n) * 2 * Math.PI;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) polyShape.moveTo(x, y);
        else polyShape.lineTo(x, y);
      }
      polyShape.closePath();
      geometry = new THREE.ShapeGeometry(polyShape);
      const polyMesh = new THREE.Mesh(geometry, mat);
      polyMesh.rotation.x = -Math.PI / 2;
      group.add(polyMesh);
      const polyEdgeGeo = new THREE.EdgesGeometry(geometry);
      const polyEdges = new THREE.LineSegments(polyEdgeGeo, edgeMat);
      polyEdges.rotation.x = -Math.PI / 2;
      group.add(polyEdges);
      // Side label
      const p1 = new THREE.Vector3(radius, 0, 0);
      const angle2 = (2 * Math.PI) / n;
      const p2 = new THREE.Vector3(radius * Math.cos(angle2), 0, -radius * Math.sin(angle2));
      labels.push(...createDimensionLine(group, p1, p2, `a=${params.a}`));
      break;
    }
    default:
      break;
  }

  return { group, labels };
}

export default function ThreeShapeViewer({ shapeType, params }) {
  const containerRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 1, 0);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // CSS2D Renderer for labels
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.pointerEvents = 'none';
    container.appendChild(labelRenderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1.2, 0);
    controls.minDistance = 2;
    controls.maxDistance = 20;
    controls.update();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);
    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-3, 4, -3);
    scene.add(dirLight2);

    // Grid
    const grid = new THREE.GridHelper(10, 10, 0xcccccc, 0xe0e0e0);
    scene.add(grid);

    // Animation loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    stateRef.current = { scene, camera, renderer, labelRenderer, controls, animId, shapeGroup: null, shapeLabels: [] };

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      // Clean label elements
      if (labelRenderer.domElement.parentNode) {
        labelRenderer.domElement.parentNode.removeChild(labelRenderer.domElement);
      }
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update shape when props change
  useEffect(() => {
    const state = stateRef.current;
    if (!state || !shapeType || !params) return;
    const { scene } = state;

    // Remove previous shape
    if (state.shapeGroup) {
      scene.remove(state.shapeGroup);
      state.shapeGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      });
    }
    // Remove previous labels
    state.shapeLabels.forEach(obj => {
      scene.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
      if (obj.element && obj.element.parentNode) {
        obj.element.parentNode.removeChild(obj.element);
      }
    });

    const { group, labels } = buildShapeMesh(shapeType, params);
    scene.add(group);
    state.shapeGroup = group;
    state.shapeLabels = labels;

    // Adjust camera for 2D vs 3D shapes
    const is2D = ['triangle', 'rectangle', 'square', 'circle', 'trapezoid', 'rhombus', 'rhomboid', 'pentagon', 'hexagon'].includes(shapeType);
    if (is2D) {
      state.camera.position.set(2, 6, 4);
      state.controls.target.set(0, 0, 0);
    } else {
      state.camera.position.set(5, 4, 5);
      state.controls.target.set(0, 1.2, 0);
    }
    state.controls.update();
  }, [shapeType, params]);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl border border-slate-200 overflow-hidden bg-slate-100"
      style={{ height: '350px' }}
    />
  );
}
