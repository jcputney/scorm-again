import {expect} from 'chai';
import {describe, it} from 'mocha';
import * as Utilities from '../src/utilities';
import Regex from '../src/constants/regex';

const scorm12_regex = Regex.scorm12;
const scorm2004_regex = Regex.scorm2004;

describe('Utility Tests', () => {
  describe('getSecondsAsHHMMSS()', () => {
    it('10 returns 00:00:10', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(10),
      ).to.equal('00:00:10');
    });

    it('60 returns 00:01:00', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(60),
      ).to.equal('00:01:00');
    });

    it('3600 returns 01:00:00', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(3600),
      ).to.equal('01:00:00');
    });

    it('70 returns 00:01:10', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(70),
      ).to.equal('00:01:10');
    });

    it('3670 returns 01:01:10', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(3670),
      ).to.equal('01:01:10');
    });

    it('90000 returns 25:00:00, check for hours greater than 24', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(90000),
      ).to.equal('25:00:00');
    });

    it('-3600 returns 00:00:00, negative time not allowed in SCORM session times',
        () => {
          expect(
              Utilities.getSecondsAsHHMMSS(-3600),
          ).to.equal('00:00:00');
        });

    it('Empty seconds returns 00:00:00', () => {
      expect(
          Utilities.getSecondsAsHHMMSS(null),
      ).to.equal('00:00:00');
    });
  });

  describe('getSecondsAsISODuration()', () => {
    it('10 returns PT10S', () => {
      expect(
          Utilities.getSecondsAsISODuration(10),
      ).to.equal('PT10S');
    });

    it('60 returns PT1M', () => {
      expect(
          Utilities.getSecondsAsISODuration(60),
      ).to.equal('PT1M');
    });

    it('3600 returns PT1H', () => {
      expect(
          Utilities.getSecondsAsISODuration(3600),
      ).to.equal('PT1H');
    });

    it('70 returns PT1M10S', () => {
      expect(
          Utilities.getSecondsAsISODuration(70),
      ).to.equal('PT1M10S');
    });

    it('916.88 returns PT15M16.88S', () => {
      expect(
          Utilities.getSecondsAsISODuration(916.88),
      ).to.equal('PT15M16.88S');
    });

    it('3670 returns PT1H1M10S', () => {
      expect(
          Utilities.getSecondsAsISODuration(3670),
      ).to.equal('PT1H1M10S');
    });

    it('90000 returns P1DT1H', () => {
      expect(
          Utilities.getSecondsAsISODuration(90000),
      ).to.equal('P1DT1H');
    });

    it('90061 returns P1DT1H1M1S', () => {
      expect(
          Utilities.getSecondsAsISODuration(90061),
      ).to.equal('P1DT1H1M1S');
    });

    it('-3600 returns PT0S, negative time not allowed in SCORM session times',
        () => {
          expect(
              Utilities.getSecondsAsISODuration(-3600),
          ).to.equal('PT0S');
        });

    it('Empty seconds returns PT0S', () => {
      expect(
          Utilities.getSecondsAsISODuration(null),
      ).to.equal('PT0S');
    });
  });

  describe('getTimeAsSeconds()', () => {
    it('00:00:10 returns 10', () => {
      expect(
          Utilities.getTimeAsSeconds('00:00:10', scorm12_regex.CMITimespan),
      ).to.equal(10);
    });

    it('00:01:10 returns 70', () => {
      expect(
          Utilities.getTimeAsSeconds('00:01:10', scorm12_regex.CMITimespan),
      ).to.equal(70);
    });

    it('01:01:10 returns 3670', () => {
      expect(
          Utilities.getTimeAsSeconds('01:01:10', scorm12_regex.CMITimespan),
      ).to.equal(3670);
    });

    it('100:00:00 returns 3670', () => {
      expect(
          Utilities.getTimeAsSeconds('100:00:00', scorm12_regex.CMITimespan),
      ).to.equal(360000);
    });

    it('-01:00:00 returns 0', () => {
      expect(
          Utilities.getTimeAsSeconds('-01:00:00', scorm12_regex.CMITimespan),
      ).to.equal(0);
    });

    it('Number value returns 0', () => {
      expect(
          Utilities.getTimeAsSeconds(999, scorm12_regex.CMITimespan),
      ).to.equal(0);
    });

    it('boolean value returns 0', () => {
      expect(
          Utilities.getTimeAsSeconds(true, scorm12_regex.CMITimespan),
      ).to.equal(0);
    });

    it('Empty value returns 0', () => {
      expect(
          Utilities.getTimeAsSeconds(null, scorm12_regex.CMITimespan),
      ).to.equal(0);
    });
  });

  describe('getDurationAsSeconds()', () => {
    it('P0S returns 0', () => {
      expect(
          Utilities.getDurationAsSeconds('P0S', scorm2004_regex.CMITimespan),
      ).to.equal(0);
    });

    it('P70S returns 70', () => {
      expect(
          Utilities.getDurationAsSeconds('P70S', scorm2004_regex.CMITimespan),
      ).to.equal(70);
    });

    it('PT1M10S returns 70', () => {
      expect(
          Utilities.getDurationAsSeconds('PT1M10S',
              scorm2004_regex.CMITimespan),
      ).to.equal(70);
    });

    it('PT15M16.88S returns 916.88', () => {
      expect(
          Utilities.getDurationAsSeconds('PT15M16.88S',
              scorm2004_regex.CMITimespan),
      ).to.equal(916.88);
    });

    it('P1D returns 86400', () => {
      expect(
          Utilities.getDurationAsSeconds('P1D', scorm2004_regex.CMITimespan),
      ).to.equal(86400);
    });

    it('P1Y returns number of seconds for one year from now', () => {
      const now = new Date();
      const oneYearFromNow = new Date(now);
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

      expect(
          Utilities.getDurationAsSeconds('P1Y', scorm2004_regex.CMITimespan),
      ).to.equal((oneYearFromNow - now) / 1000.0);
    });

    it('Invalid duration returns 0', () => {
      expect(
          Utilities.getDurationAsSeconds('T1M10S', scorm2004_regex.CMITimespan),
      ).to.equal(0);
    });

    it('Empty duration returns 0', () => {
      expect(
          Utilities.getDurationAsSeconds(null, scorm2004_regex.CMITimespan),
      ).to.equal(0);
    });
  });

  describe('addTwoDurations()', () => {
    it('P1H5M30.5S plus PT15M10S equals P1H20M40.5S', () => {
      expect(
          Utilities.addTwoDurations('PT1H5M30.5S', 'PT15M30S',
              scorm2004_regex.CMITimespan),
      ).to.equal('PT1H21M0.5S');
    });
    it('P1Y364D plus P2DT1H45M52S equals P731DT1H45M52S', () => {
      expect(
          Utilities.addTwoDurations('P1Y364D', 'P2DT1H45M52S',
              scorm2004_regex.CMITimespan),
      ).to.equal('P731DT1H45M52S');
    });
    it('Invalid plus valid equals valid', () => {
      expect(
          Utilities.addTwoDurations('NOT A VALID DURATION', 'PT1H30M45S',
              scorm2004_regex.CMITimespan),
      ).to.equal('PT1H30M45S');
    });
    it('Valid plus invalid equals valid', () => {
      expect(
          Utilities.addTwoDurations('PT1H30M45S', 'NOT A VALID DURATION',
              scorm2004_regex.CMITimespan),
      ).to.equal('PT1H30M45S');
    });
  });

  describe('addHHMMSSTimeStrings()', () => {
    it('01:05:30.5 plus 00:15:10 equals 01:20:40.5', () => {
      expect(
          Utilities.addHHMMSSTimeStrings('01:05:30.5', '00:15:30',
              scorm12_regex.CMITimespan),
      ).to.equal('01:21:00.5');
    });
    it('17496:00:00 plus 49:35:52 equals 17545:35:52', () => {
      expect(
          Utilities.addHHMMSSTimeStrings('17496:00:00', '49:35:52',
              scorm12_regex.CMITimespan),
      ).to.equal('17545:35:52');
    });
    it('Invalid plus valid equals valid', () => {
      expect(
          Utilities.addHHMMSSTimeStrings('-00:15:10', '01:05:30.5',
              scorm12_regex.CMITimespan),
      ).to.equal('01:05:30.5');
    });
    it('Valid plus invalid equals valid', () => {
      expect(
          Utilities.addHHMMSSTimeStrings('01:05:30.5', 'NOT A VALID DURATION',
              scorm12_regex.CMITimespan),
      ).to.equal('01:05:30.5');
    });
  });

  describe('flatten()', () => {
    it('Should return flattened object', () => {
      expect(
          Utilities.flatten({
            'cmi': {
              'core': {
                'learner_id': 'jputney',
                'learner_name': 'Jonathan',
              },
              'objectives': {
                '0': {
                  'id': 'AAA',
                },
                '1': {
                  'id': 'BBB',
                },
              },
            },
          }),
      ).to.eql({
        'cmi.core.learner_id': 'jputney',
        'cmi.core.learner_name': 'Jonathan',
        'cmi.objectives.0.id': 'AAA',
        'cmi.objectives.1.id': 'BBB',
      });
    });
  });

  describe('unflatten()', () => {
    it('Should return flattened object', () => {
      expect(
          Utilities.unflatten({
            'cmi.core.learner_id': 'jputney',
            'cmi.core.learner_name': 'Jonathan',
            'cmi.objectives.0.id': 'AAA',
            'cmi.objectives.1.id': 'BBB',
          }),
      ).to.eql({
        'cmi': {
          'core': {
            'learner_id': 'jputney',
            'learner_name': 'Jonathan',
          },
          'objectives': {
            '0': {
              'id': 'AAA',
            },
            '1': {
              'id': 'BBB',
            },
          },
        },
      });
    });
  });
});
