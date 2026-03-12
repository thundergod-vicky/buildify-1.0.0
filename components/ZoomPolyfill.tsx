"use client";

import React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

if (typeof window !== 'undefined') {
    const anyWindow = window as any;
    const anyGlobal = globalThis as any;

    // --- 1. PERSISTENT STATE FOR HMR STABILITY ---
    if (!anyWindow.__REACT_19_POLYFILL_STATE__) {
        const rd = ReactDOM as any;
        const rdc = ReactDOMClient as any;
        const r = React as any;
        
        anyWindow.__REACT_19_POLYFILL_STATE__ = {
            nativeCreateRoot: (rdc.createRoot || rdc.default?.createRoot || rd.createRoot || (rd.default as any)?.createRoot),
            nativeCreatePortal: (rd.createPortal || rdc.createPortal || rdc.default?.createPortal || rd.default?.createPortal),
            nativeCreateElement: r.createElement,
            nativeCloneElement: r.cloneElement,
            nativeJsx: (r as any).jsx,
            nativeJsxs: (r as any).jsxs,
            nativeJsxDev: (r as any).jsxDev,
            nativeChildrenMap: r.Children?.map,
            // Sync all React 19 Symbols from the current environment
            symbols: {
                element: Symbol.for('react.element'),
                portal: Symbol.for('react.portal'),
                fragment: Symbol.for('react.fragment'),
                strict_mode: Symbol.for('react.strict_mode'),
                profiler: Symbol.for('react.profiler'),
                provider: Symbol.for('react.provider'),
                context: Symbol.for('react.context'),
                forward_ref: Symbol.for('react.forward_ref'),
                suspense: Symbol.for('react.suspense'),
                suspense_list: Symbol.for('react.suspense_list'),
                memo: Symbol.for('react.memo'),
                lazy: Symbol.for('react.lazy'),
            }
        };
    }

    const state = anyWindow.__REACT_19_POLYFILL_STATE__;
    const { element: REACT_ELEMENT_TYPE } = state.symbols;

    const healedCache = new WeakMap();

    /**
     * Deep Healing Engine: Upgrades legacy React elements to the native environment.
     */
    const healElement = (el: any): any => {
        if (!el || typeof el !== 'object') return el;
        
        if (Array.isArray(el)) {
            let modified = false;
            const newArr = el.map(item => {
                const h = healElement(item);
                if (h !== item) modified = true;
                return h;
            });
            return modified ? newArr : el;
        }

        if (healedCache.has(el)) return healedCache.get(el);

        const isElementLike = el.$$typeof || (el.type && el.props);
        if (isElementLike) {
            let healed = el;
            const current$$typeof = el.$$typeof;
            const typeStr = String(current$$typeof || '');
            const isNative = typeof current$$typeof === 'symbol' && typeStr.includes('Symbol(react.');

            if (!isNative) {
                // LEGACY ELEMENT DETECTED: Upgrade Symbols
                let targetSymbol = REACT_ELEMENT_TYPE;
                if (typeStr.includes('portal') || current$$typeof === 0xeaca) targetSymbol = state.symbols.portal;
                else if (typeStr.includes('fragment') || current$$typeof === 0xeacb) targetSymbol = state.symbols.fragment;
                else if (typeStr.includes('strict_mode') || current$$typeof === 0xeacc) targetSymbol = state.symbols.strict_mode;
                else if (typeStr.includes('profiler') || current$$typeof === 0xead2) targetSymbol = state.symbols.profiler;
                else if (typeStr.includes('provider') || current$$typeof === 0xeacd) targetSymbol = state.symbols.provider;
                else if (typeStr.includes('context') || current$$typeof === 0xeace) targetSymbol = state.symbols.context;
                else if (typeStr.includes('forward_ref') || current$$typeof === 0xeacf) targetSymbol = state.symbols.forward_ref;
                else if (typeStr.includes('suspense_list') || current$$typeof === 0xead8) targetSymbol = state.symbols.suspense_list;
                else if (typeStr.includes('suspense') || current$$typeof === 0xead1) targetSymbol = state.symbols.suspense;
                else if (typeStr.includes('memo') || current$$typeof === 0xead3) targetSymbol = state.symbols.memo;
                else if (typeStr.includes('lazy') || current$$typeof === 0xead4) targetSymbol = state.symbols.lazy;

                if (current$$typeof !== targetSymbol) {
                    try {
                        if (Object.isFrozen(healed)) healed = { ...el, $$typeof: targetSymbol };
                        else healed.$$typeof = targetSymbol;
                    } catch {
                        healed = { ...el, $$typeof: targetSymbol };
                    }
                }

                // LEGACY ELEMENT DETECTED: Sync Ref (Safe as it's not a React 19 Element yet)
                if (Object.prototype.hasOwnProperty.call(healed, 'ref')) {
                    const legacyRef = healed.ref;
                    if (legacyRef !== undefined && (!healed.props || healed.props.ref === undefined)) {
                        try {
                            if (Object.isFrozen(healed.props)) healed.props = { ...healed.props, ref: legacyRef };
                            else healed.props.ref = legacyRef;
                        } catch {
                            healed = { ...healed, props: { ...(healed.props || {}), ref: legacyRef } };
                        }
                    }
                }
            }

            // --- DEEP WRAP COMPONENTS ---
            const elType = healed.type;
            if (elType && typeof elType === 'object') {
                 if (elType.$$typeof === state.symbols.forward_ref && elType.render && !elType.__isHealed) {
                     const originalRender = elType.render;
                     const newRender = function(this: any, ...args: any[]) {
                        return healElement(originalRender.apply(this, args));
                     };
                     try {
                        if (Object.isFrozen(elType)) {
                            // Can't wrap frozen type objects easily without potential side effects, 
                            // but we can try to wrap the element type itself if it's the top level
                            if (Object.isFrozen(healed)) healed = { ...healed, type: { ...elType, render: newRender, __isHealed: true } };
                            else healed.type = { ...elType, render: newRender, __isHealed: true };
                        } else {
                            elType.render = newRender;
                            elType.__isHealed = true;
                        }
                     } catch {
                         healed = { ...healed, type: { ...elType, render: newRender, __isHealed: true } };
                     }
                 }
            } else if (typeof elType === 'function' && !elType.__isHealed) {
                const originalType = elType;
                if (originalType.prototype && originalType.prototype.isReactComponent) {
                    const originalRender = originalType.prototype.render;
                    originalType.prototype.render = function(this: any, ...args: any[]) {
                        return healElement(originalRender.apply(this, args));
                    };
                } else {
                    const wrappedFunc = function(this: any, ...args: any[]) {
                        return healElement(originalType.apply(this, args));
                    };
                    Object.assign(wrappedFunc, originalType);
                    try { (wrappedFunc as any).__isHealed = true; } catch {}
                    
                    try {
                        if (Object.isFrozen(healed)) healed = { ...healed, type: wrappedFunc };
                        else healed.type = wrappedFunc;
                    } catch {
                        healed = { ...healed, type: wrappedFunc };
                    }
                }
                try { originalType.__isHealed = true; } catch {}
            }

            // --- RECURSIVE PROP SCANNING ---
            if (healed.props) {
                const keys = Object.keys(healed.props);
                for (let i = 0; i < keys.length; i++) {
                    const key = keys[i];
                    if (key === 'ref' && isNative) continue; // Skip native ref to avoid getter warning
                    
                    const pVal = healed.props[key];
                    if (pVal && typeof pVal === 'object') {
                        const hVal = healElement(pVal);
                        if (hVal !== pVal) {
                             try {
                                if (Object.isFrozen(healed.props)) healed.props = { ...healed.props, [key]: hVal };
                                else healed.props[key] = hVal;
                             } catch {
                                 healed = { ...healed, props: { ...healed.props, [key]: hVal } };
                             }
                        }
                    }
                }
            }

            healedCache.set(el, healed);
            return healed;
        }
        return el;
    };

    const sharedInternals = {
        ReactCurrentOwner: { current: null },
        ReactCurrentDispatcher: { current: { readContext: (c: any) => c?._currentValue } },
        ReactCurrentBatchConfig: { transition: 0 },
        usingClientEntryPoint: true,
    };

    const secretInternals = {
        ...sharedInternals,
        ReactSharedInternals: sharedInternals
    };

    const r = React as any;
    const rd = ReactDOM as any;
    const rdc = ReactDOMClient as any;

    // --- 2. PATCH REACT METHODS ---
    const reactTargets = [r, r.default, anyWindow.React, anyGlobal.React, anyGlobal.global?.React].filter(Boolean);
    reactTargets.forEach((t: any) => {
        try {
            t.version = t.version || "18.2.0";
            t.ReactSharedInternals = secretInternals.ReactSharedInternals;
            t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = secretInternals;
            t.ReactCurrentOwner = secretInternals.ReactCurrentOwner;
            
            const mapping: any = {
                createElement: state.nativeCreateElement,
                cloneElement: state.nativeCloneElement,
                jsx: state.nativeJsx,
                jsxs: state.nativeJsxs,
                jsxDev: state.nativeJsxDev
            };

            Object.keys(mapping).forEach(m => {
                const native = mapping[m];
                if (native && !t[m]?.__isPolyfilled) {
                    const patched = function(this: any, ...args: any[]) {
                        return healElement(native.apply(this, args));
                    };
                    (patched as any).__isPolyfilled = true;
                    t[m] = patched;
                }
            });

            if (t.Children && state.nativeChildrenMap) {
                t.Children.map = function(this: any, ...args: any[]) {
                    return healElement(state.nativeChildrenMap.apply(this, args));
                };
            }

            if (!t.createFactory) {
                t.createFactory = (type: any) => t.createElement.bind(null, type);
            }

            t.isValidElement = (item: any) => item && (item.$$typeof === REACT_ELEMENT_TYPE || (item.type && item.props));
            if (!t.unstable_batchedUpdates) t.unstable_batchedUpdates = (fn: any) => fn();
            if (!t.Fragment) t.Fragment = state.symbols.fragment;
            if (!t.default) t.default = t;
        } catch {}
    });

    // --- 3. PATCH REACDOM METHODS ---
    const roots = new WeakMap();
    const mergedReactDOM = {
        ...(rd.default || rd),
        ...(rdc.default || rdc),
        ...rd,
        ...rdc
    } as any;

    mergedReactDOM.createRoot = function(this: any, container: any, options?: any) {
        if (!state.nativeCreateRoot) return null;
        const root = state.nativeCreateRoot.call(this, container, options);
        if (!root) return null;
        
        const originalRender = root.render;
        root.render = function(this: any, children: any) {
            return originalRender.call(this, healElement(children));
        };
        return root;
    };

    mergedReactDOM.createPortal = function(this: any, children: any, container: any, key?: any) {
        if (!state.nativeCreatePortal) return null;
        const portal = state.nativeCreatePortal.call(this, healElement(children), container, key);
        return healElement(portal);
    };

    mergedReactDOM.render = (element: any, container: any, callback?: any) => {
        if (!container) return;
        try {
            const healedElement = healElement(element);
            let root = roots.get(container);
            if (!root) {
                root = mergedReactDOM.createRoot(container);
                roots.set(container, root);
            }
            if (root) root.render(healedElement);
            if (callback) setTimeout(callback, 0);
            return root;
        } catch (e) {
            console.error("ReactDOM.render polyfill fail:", e);
        }
    };

    mergedReactDOM.unmountComponentAtNode = (container: any) => {
        const root = roots.get(container);
        if (root) {
            root.unmount();
            roots.delete(container);
            return true;
        }
        return false;
    };

    mergedReactDOM.findDOMNode = rd.findDOMNode || ((inst: any) => inst);
    mergedReactDOM.flushSync = rdc.flushSync || rdc.default?.flushSync || rd.flushSync || ((fn: any) => fn());
    mergedReactDOM.unstable_batchedUpdates = rd.unstable_batchedUpdates || rd.default?.unstable_batchedUpdates || ((fn: any) => fn());

    const domTargets = [rd, rd.default, anyWindow.ReactDOM, anyGlobal.ReactDOM].filter(Boolean);
    domTargets.forEach((t: any) => {
        try {
             Object.assign(t, mergedReactDOM);
             if (!t.default) t.default = mergedReactDOM;
        } catch {}
    });

    const domClientTargets = [rdc, rdc.default, anyWindow.ReactDOMClient, anyGlobal.ReactDOMClient].filter(Boolean);
    domClientTargets.forEach((t: any) => {
        try {
            t.createRoot = mergedReactDOM.createRoot;
            if (!t.default) t.default = t;
        } catch {}
    });

    anyWindow.React = r;
    anyWindow.ReactDOM = mergedReactDOM;
    anyWindow.ReactDOMClient = mergedReactDOM;
    anyGlobal.React = r;
    anyGlobal.ReactDOM = mergedReactDOM;
}

export default function ZoomPolyfill() {
    return null;
}
