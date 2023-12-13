import { html, render } from 'https://unpkg.com/lit-html@1.3.0?module';
import { until } from 'https://unpkg.com/lit-html@1.3.0/directives/until?module';

const api = {
    async get(url) {
        return json(url);
    },
    async post(url, body) {
        return json(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
    }
};

async function json(url, options) {
    return await (await fetch('/' + url, options)).json();
}

async function getCollections() {
    return api.get('data');
}

async function getRecords(collection) {
    return api.get('data/' + collection);
}

async function getThrottling() {
    return api.get('util/throttle');
}

async function setThrottling(throttle) {
    return api.post('util', { throttle });
}

async function collectionList(onSelect) {
    const collections = await getCollections();

    return html`
    <ul class="collection-list">
        ${collections.map(collectionLi)}
    </ul>`;

    function collectionLi(name) {
        return html`<li><a href="javascript:void(0)" @click=${(ev) => onSelect(ev, name)}>${name}</a></li>`;
    }
}

async function recordTable(collectionName) {
    const records = await getRecords(collectionName);
    const layout = getLayout(records);

    return html`
    <table>
        <caption>${collectionName}</caption>
        <thead>
            <tr>${layout.map(f => html`<th>${f}</th>`)}</tr>
        </thead>
        <tbody>
            ${records.map(r => recordRow(r, layout))}
        </tbody>
    </table>`;
}

function getLayout(records) {
    const result = new Set(['_id']);
    records.forEach(r => Object.keys(r).forEach(k => result.add(k)));

    return [...result.keys()];
}

function recordRow(record, layout) {
    return html`
    <tr>
        ${layout.map(f => html`<td>${JSON.stringify(record[f]) || html`<span>(missing)</span>`}</td>`)}
    </tr>`;
}

async function throttlePanel(display) {
    const active = await getThrottling();

    return html`
    <p>
        Request throttling: </span>${active}</span>
        <button @click=${(ev) => set(ev, true)}>Enable</button>
        <button @click=${(ev) => set(ev, false)}>Disable</button>
    </p>`;

    async function set(ev, state) {
        ev.target.disabled = true;
        await setThrottling(state);
        display();
    }
}

//import page from '//unpkg.com/page/page.mjs';


function start() {
    const main = document.querySelector('main');
    editor(main);
}

async function editor(main) {
    let list = html`<div class="col">Loading&hellip;</div>`;
    let viewer = html`<div class="col">
    <p>Select collection to view records</p>
</div>`;
    display();

    list = html`<div class="col">${await collectionList(onSelect)}</div>`;
    display();

    async function display() {
        render(html`
        <section class="layout">
            ${until(throttlePanel(display), html`<p>Loading</p>`)}
        </section>
        <section class="layout">
            ${list}
            ${viewer}
        </section>`, main);
    }

    async function onSelect(ev, name) {
        ev.preventDefault();
        viewer = html`<div class="col">${await recordTable(name)}</div>`;
        display();
    }
}

start();
