/* global describe it */

import * as assert from 'assert';
import I18n from '../src';

const languages = [`en`, `pt`];
const i18n = new I18n(`${__dirname}/localization`, languages);

describe(`new-i18n`, () => {
    it(`Should throw an error if there are no languages`, () => {
        const error = `You need to add at least one language.`;
        // @ts-expect-error
        assert.throws(() => new I18n(``), Error, error);
        assert.throws(() => new I18n(``, []), Error, error);
    });

    it(`Should work with nested keys`, () => {
        assert.equal(i18n.translate(`en`, `nested.key`), `value`);
        assert.equal(i18n.translate(`en`, `nested.double_nested.key`), `value`);
    });

    it(`Should return \`null\` if there's no value`, () => {
        const keyword = `non_existent_key`;
        const nested = `nested.${keyword}`;
        const anotherNested = `${keyword}.${keyword}`;

        assert.equal(i18n.translate(`en`, keyword), null);
        assert.equal(i18n.translate(`en`, nested), null);
        assert.equal(i18n.translate(`en`, anotherNested), null);
    });

    it(`Should return \`null\` if there's no value in the fallback`, () => {
        const i18n = new I18n(`${__dirname}/localization`, languages, `pt`);
        const keyword = `non_existent_key`;
        const nested = `nested.${keyword}`;
        const anotherNested = `${keyword}.${keyword}`;

        assert.equal(i18n.translate(`en`, keyword), null);
        assert.equal(i18n.translate(`en`, nested), null);
        assert.equal(i18n.translate(`en`, anotherNested), null);
    });

    it(`Should fallback to the specified language`, () => {
        const i18n = new I18n(`${__dirname}/localization`, languages, `pt`);
        const keyword = `fallback`;
        const nested = `nested.${keyword}`;
        const doubleNested = `nested.double_nested.${keyword}`;

        assert.equal(i18n.translate(`en`, keyword), keyword);
        assert.equal(i18n.translate(`en`, nested), keyword);
        assert.equal(i18n.translate(`en`, doubleNested), keyword);
    });

    it(`Shouldn't recurse forever while falling back`, () => {
        const i18n = new I18n(`${__dirname}/localization`, languages, `pt`);
        const keyword = `non_existent_key`;
        const nested = `nested.${keyword}`;
        const anotherNested = `${keyword}.${keyword}`;

        assert.equal(i18n.translate(`en`, keyword), null);
        assert.equal(i18n.translate(`en`, nested), null);
        assert.equal(i18n.translate(`en`, anotherNested), null);
    });

    const variableValue = `value`;

    it(`Should work with variables`, () => {
        const variable = {
            variable: variableValue,
        };

        assert.equal(i18n.translate(`en`, `with_variables`, variable), variableValue);
        assert.equal(i18n.translate(`en`, `nested.with_variables`, variable), variableValue);
    });

    it(`Shouldn't replace unknown variables `, () => {
        const variable = {
            unknown_variable: variableValue,
        };

        assert.notEqual(i18n.translate(`en`, `with_variables`, variable), variableValue);
        assert.notEqual(i18n.translate(`en`, `nested.with_variables`, variable), variableValue);
    });

    it(`Should work with multiple variables`, () => {
        assert.equal(
            i18n.translate(`en`, `with_multiple_variables`, {
                variable1: variableValue,
                variable2: variableValue,
            }),
            `${variableValue} ${variableValue}`,
        );
    });

    it(`Should allow updating languages`, () => {
        i18n.update(`en`, {
            nested: {
                other: {
                    key: `value`,
                },
            },
        });

        assert.equal(i18n.translate(`en`, `nested.other.key`), `value`);
    });

    it(`Should have a .languages property`, () => {
        assert.deepEqual(i18n.languages, languages);
    });

    it(`Should only show the languages for the current instance`, () => {
        const i18n1 = new I18n(`${__dirname}/localization`, [`en`]);
        assert.deepEqual(i18n1.languages, [`en`]);

        const i18n2 = new I18n(`${__dirname}/localization`, [`pt`]);
        assert.deepEqual(i18n2.languages, [`pt`]);
    });
});
