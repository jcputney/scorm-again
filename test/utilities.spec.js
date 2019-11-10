import { expect } from 'chai';
import {describe, it} from "mocha";
import * as Utilities  from '../src/utilities';
import {scorm12_regex, scorm2004_regex} from "../src/regex";

describe('Utility Tests', () => {
   describe('function getSecondsAsHHMMSS()', () => {
      it('10 returns 00:00:10', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(10)
         ).to.equal('00:00:10');
      });

      it('60 returns 00:01:00', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(60)
         ).to.equal('00:01:00');
      });

      it('3600 returns 01:00:00', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(3600)
         ).to.equal('01:00:00');
      });

      it('70 returns 00:01:10', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(70)
         ).to.equal('00:01:10');
      });

      it('3670 returns 01:01:10', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(3670)
         ).to.equal('01:01:10');
      });

      it('90000 returns 25:00:00, check for hours greater than 24', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(90000)
         ).to.equal('25:00:00');
      });

      it('-3600 returns 00:00:00, negative time not allowed in SCORM session times', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(-3600)
         ).to.equal('00:00:00');
      });

      it('Empty seconds returns 00:00:00', () => {
         expect(
             Utilities.getSecondsAsHHMMSS(null)
         ).to.equal('00:00:00');
      });
   });

   describe('function getSecondsAsISODuration()', () => {
      it('10 returns P10S', () => {
         expect(
             Utilities.getSecondsAsISODuration(10)
         ).to.equal('P10S');
      });

      it('60 returns P1M', () => {
         expect(
             Utilities.getSecondsAsISODuration(60)
         ).to.equal('P1M');
      });

      it('3600 returns P1H', () => {
         expect(
             Utilities.getSecondsAsISODuration(3600)
         ).to.equal('P1H');
      });

      it('70 returns P1M10S', () => {
         expect(
             Utilities.getSecondsAsISODuration(70)
         ).to.equal('P1M10S');
      });

      it('3670 returns P1H1M10S', () => {
         expect(
             Utilities.getSecondsAsISODuration(3670)
         ).to.equal('P1H1M10S');
      });

      it('90000 returns P1D1H', () => {
         expect(
             Utilities.getSecondsAsISODuration(90000)
         ).to.equal('P1D1H');
      });

      it('90061 returns P1D1H1M1S', () => {
         expect(
             Utilities.getSecondsAsISODuration(90061)
         ).to.equal('P1D1H1M1S');
      });

      it('-3600 returns P0S, negative time not allowed in SCORM session times', () => {
         expect(
             Utilities.getSecondsAsISODuration(-3600)
         ).to.equal('P0S');
      });

      it('Empty seconds returns P0S', () => {
         expect(
             Utilities.getSecondsAsISODuration(null)
         ).to.equal('P0S');
      });
   });

   describe('function getTimeAsSeconds()', () => {
      it('00:00:10 returns 10', () => {
         expect(
             Utilities.getTimeAsSeconds('00:00:10', scorm12_regex.CMITimespan)
         ).to.equal(10);
      });

      it('00:01:10 returns 70', () => {
         expect(
             Utilities.getTimeAsSeconds('00:01:10', scorm12_regex.CMITimespan)
         ).to.equal(70);
      });

      it('01:01:10 returns 3670', () => {
         expect(
             Utilities.getTimeAsSeconds('01:01:10', scorm12_regex.CMITimespan)
         ).to.equal(3670);
      });

      it('100:00:00 returns 3670', () => {
         expect(
             Utilities.getTimeAsSeconds('100:00:00', scorm12_regex.CMITimespan)
         ).to.equal(360000);
      });

      it('-01:00:00 returns 0', () => {
         expect(
             Utilities.getTimeAsSeconds('-01:00:00', scorm12_regex.CMITimespan)
         ).to.equal(0);
      });

      it('Number value returns 0', () => {
         expect(
             Utilities.getTimeAsSeconds(999, scorm12_regex.CMITimespan)
         ).to.equal(0);
      });

      it('boolean value returns 0', () => {
         expect(
             Utilities.getTimeAsSeconds(true, scorm12_regex.CMITimespan)
         ).to.equal(0);
      });

      it('Empty value returns 0', () => {
         expect(
             Utilities.getTimeAsSeconds(null, scorm12_regex.CMITimespan)
         ).to.equal(0);
      });
   });

   describe('function getDurationAsSeconds()', () => {
      it('P0S returns 0', () => {
         expect(
             Utilities.getDurationAsSeconds('P0S', scorm2004_regex.CMITimespan)
         ).to.equal(0);
      });

      it('P70S returns 70', () => {
         expect(
             Utilities.getDurationAsSeconds('P70S', scorm2004_regex.CMITimespan)
         ).to.equal(70);
      });

      it('PT1M10S returns 70', () => {
         expect(
             Utilities.getDurationAsSeconds('PT1M10S', scorm2004_regex.CMITimespan)
         ).to.equal(70);
      });

      it('P1D returns 86400', () => {
         expect(
             Utilities.getDurationAsSeconds('P1D', scorm2004_regex.CMITimespan)
         ).to.equal(86400);
      });

      it('P1M returns number of seconds for one month from now', () => {
         const now = new Date();
         let oneMonthFromNow = new Date(now);
         oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

         expect(
             Utilities.getDurationAsSeconds('P1M', scorm2004_regex.CMITimespan)
         ).to.equal((oneMonthFromNow - now) / 1000.0);
      });

      it('P1Y returns number of seconds for one year from now', () => {
         const now = new Date();
         let oneYearFromNow = new Date(now);
         oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

         expect(
             Utilities.getDurationAsSeconds('P1Y', scorm2004_regex.CMITimespan)
         ).to.equal((oneYearFromNow - now) / 1000.0);
      });

      it('Invalid duration returns 0', () => {
         expect(
             Utilities.getDurationAsSeconds('T1M10S', scorm2004_regex.CMITimespan)
         ).to.equal(0);
      });

      it('Empty duration returns 0', () => {
         expect(
             Utilities.getDurationAsSeconds(null, scorm2004_regex.CMITimespan)
         ).to.equal(0);
      });
   });
});