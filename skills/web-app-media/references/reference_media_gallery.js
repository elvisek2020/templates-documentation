/*
 * reference_media_gallery.js — galerie fotek
 * -----------------------------------------------------------------------------
 * Zkopíruj do app/static/js/media-gallery.js a načti na stránce s galerií:
 *     <script src="/static/js/media-gallery.js?v={{ app_version }}" defer></script>
 *
 * Očekává v HTML:
 *   <form class="media-dropzone" data-dropzone> s <input type="file"> a [name=parent_id]
 *   <div id="media-gallery"> s dlaždicemi .media-tile[data-media-id][draggable]
 *
 * Endpointy: POST /media/upload, POST /media/reorder (viz TEMPLATE_MEDIA.md).
 */
(function () {
    function initDropzone() {
        var zone = document.querySelector("[data-dropzone]");
        if (!zone) return;
        var input = zone.querySelector('input[type="file"]');
        if (!input) return;

        zone.addEventListener("click", function (e) {
            if (e.target.closest("button, label, input[type=checkbox]")) return;
            input.click();
        });
        zone.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                input.click();
            }
        });

        ["dragenter", "dragover"].forEach(function (evt) {
            zone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.add("is-dragover");
            });
        });
        ["dragleave", "drop"].forEach(function (evt) {
            zone.addEventListener(evt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                zone.classList.remove("is-dragover");
            });
        });
        zone.addEventListener("drop", function (e) {
            var files = e.dataTransfer && e.dataTransfer.files;
            if (!files || !files.length) return;
            input.files = files;
            submitFiles(zone, files);
        });
        input.addEventListener("change", function () {
            if (input.files && input.files.length) {
                submitFiles(zone, input.files);
            }
        });
    }

    function submitFiles(zone, files) {
        zone.classList.add("is-uploading");
        if (typeof showNotification === "function") {
            showNotification(files.length > 1 ? "Nahrávám " + files.length + " fotek…" : "Nahrávám fotku…", "info");
        }
        if (files.length === 1) {
            zone.submit();
        } else {
            // multiple: upload sequentially via FormData
            uploadMany(zone, files);
        }
    }

    function uploadMany(form, files) {
        var parentId = form.querySelector('[name="parent_id"]').value;
        var isCover = form.querySelector('[name="is_cover"]');
        var coverFirst = isCover && isCover.checked;
        var chain = Promise.resolve();
        Array.prototype.forEach.call(files, function (file, idx) {
            chain = chain.then(function () {
                var fd = new FormData();
                fd.append("parent_id", parentId);
                fd.append("file", file);
                if (coverFirst && idx === 0) fd.append("is_cover", "1");
                return fetch("/media/upload", { method: "POST", body: fd, redirect: "follow" });
            });
        });
        chain.then(function () {
            window.location.reload();
        }).catch(function () {
            window.location.reload();
        });
    }

    function initReorder() {
        var gallery = document.getElementById("media-gallery");
        if (!gallery) return;
        var dragging = null;

        gallery.querySelectorAll(".media-tile").forEach(function (tile) {
            tile.addEventListener("dragstart", function (e) {
                dragging = tile;
                tile.classList.add("is-dragging");
                if (e.dataTransfer) {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", tile.dataset.mediaId);
                }
            });
            tile.addEventListener("dragend", function () {
                tile.classList.remove("is-dragging");
                dragging = null;
                persistOrder(gallery);
            });
            tile.addEventListener("dragover", function (e) {
                e.preventDefault();
                if (!dragging || dragging === tile) return;
                var rect = tile.getBoundingClientRect();
                var before = e.clientY < rect.top + rect.height / 2;
                gallery.insertBefore(dragging, before ? tile : tile.nextSibling);
            });
        });
    }

    function persistOrder(gallery) {
        var ids = Array.prototype.map.call(
            gallery.querySelectorAll(".media-tile"),
            function (t) { return parseInt(t.dataset.mediaId, 10); }
        );
        fetch("/media/reorder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ids: ids }),
        }).catch(function () {});
    }

    document.addEventListener("DOMContentLoaded", function () {
        initDropzone();
        initReorder();
    });
})();
