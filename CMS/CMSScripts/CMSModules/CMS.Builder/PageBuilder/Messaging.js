﻿cmsdefine([
    'CMS.Builder/MessageService',
    'CMS.Builder/PageBuilder/DragAndDropService',
    'CMS.Builder/PageBuilder/ModalDialogService',
    'CMS.Builder/MessageTypes'
], function (msgService, dndService, modalService, messageTypes) {

    var Module = function (serverData) {
        var frameLoaded = false;
        var contentModified = false;
        var frame = document.getElementById(serverData.frameId);
        var frameUrl = serverData.frameUrl;
        var instanceGuid = serverData.guid;
        var targetOrigin = serverData.origin;
        var documentGuid = serverData.documentGuid;
        var isPostBack = serverData.isPostBack;
        var originalScript;

        var DISPLAYED_WIDGET_VARIANTS_SESSION_STORAGE_KEY = 'Kentico.DisplayedWidgetVariants|' + documentGuid;

        var receiveMessage = function (event) {
            if (event.origin !== targetOrigin) {
                return;
            }

            switch (event.data.msg) {
                case messageTypes.CONFIGURATION_STORED:
                    var eventData = event.data && event.data.data;
                    if (eventData) {
                        sessionStorage.setItem(DISPLAYED_WIDGET_VARIANTS_SESSION_STORAGE_KEY, event.data.data);
                    }

                    eval(originalScript);
                    break;

                case messageTypes.CONFIGURATION_CHANGED:
                    window.CMSContentManager && window.CMSContentManager.changed(true);
                    window.top.CancelScreenLockCountdown && window.top.CancelScreenLockCountdown();
                    break;

                case messageTypes.MESSAGING_ERROR:
                    msgService.showError(event.data.data, true);
                    break;

                case messageTypes.MESSAGING_EXCEPTION:
                    msgService.showError(event.data.data);
                    break;

                case messageTypes.MESSAGING_WARNING:
                    msgService.showWarning(event.data.data);
                    break;

                case messageTypes.MESSAGING_DRAG_START:
                    dndService.addDnDCancellationEvents();
                    break;

                case messageTypes.MESSAGING_DRAG_STOP:
                    dndService.removeDnDCancellationEvents();
                    break;

                case messageTypes.GET_DISPLAYED_WIDGET_VARIANTS:
                    var displayedWidgetVariants = sessionStorage.getItem(DISPLAYED_WIDGET_VARIANTS_SESSION_STORAGE_KEY);

                    if (displayedWidgetVariants) {
                        frame.contentWindow.postMessage({ msg: messageTypes.LOAD_DISPLAYED_WIDGET_VARIANTS, data: displayedWidgetVariants }, targetOrigin);
                    }
                    break;

                case messageTypes.OPEN_MODAL_DIALOG:
                    modalService.addModalDialogOverlay();
                    break;

                case messageTypes.CLOSE_MODAL_DIALOG:
                    modalService.removeModalDialogOverlay();
                    break;
            }
        };

        var deleteDisplayedWidgetVariants = function () {
            var displayedWidgetVariants = sessionStorage.getItem(DISPLAYED_WIDGET_VARIANTS_SESSION_STORAGE_KEY);

            // Delete data in session storage on full page refresh
            if (!isPostBack && displayedWidgetVariants) {
                sessionStorage.removeItem(DISPLAYED_WIDGET_VARIANTS_SESSION_STORAGE_KEY);
            }
        };

        var registerPostMessageListener = function () {
            window.addEventListener('message', receiveMessage);
        };

        var registerOnLoadListener = function () {
            frame.addEventListener('load', deleteDisplayedWidgetVariants);
        };

        var saveConfiguration = function (script) {
            if (frameLoaded === false) return;

            originalScript = script;

            frame.contentWindow.postMessage({ msg: messageTypes.SAVE_CONFIGURATION, guid: instanceGuid, contentModified: contentModified }, targetOrigin);
        };

        var bindSaveChanges = function () {
            window.CMSContentManager && window.CMSContentManager.eventManager.on('contentChanged', function (event, isModified) {
                contentModified = isModified;
            });
        };

        var bindFrameLoad = function () {
            frame.addEventListener('load', function () {
                frameLoaded = true;
                if (window.parent.Loader) {
                    window.parent.Loader.hide();
                }
            });
        };

        var handleFrameHeight = function () {
            var resize = function () {
                var panel = document.getElementsByClassName('preview-edit-panel')[0];

                if (panel) {
                    var height = document.body.offsetHeight - panel.offsetHeight;
                    frame.height = height;
                }
            };

            // Use jQuery to handle cross-browser compatibility
            $cmsj(window).bind('resize', resize);
            $cmsj(document).ready(resize);
        };

        var loadFrame = function () {
            frame.setAttribute("src", frameUrl);
            if (window.parent.Loader) {
                window.parent.Loader.show();
            }
        };

        handleFrameHeight();
        bindSaveChanges();
        bindFrameLoad();
        registerPostMessageListener();
        registerOnLoadListener();

        loadFrame();

        window.CMS = window.CMS || {};
        var pageBuilder = window.CMS.PageBuilder = window.CMS.PageBuilder || {};
        pageBuilder.save = saveConfiguration;
    };

    return Module;
});