// Setup our fake LMS APIs
console.lms = console.log;
const server = new Pretender(function() {
  this.post('/scorm2004', function(request) {
    console.lms('LMS Received SCORM 2004 Commit: \n' +
        JSON.stringify(JSON.parse(request.requestBody), null, 2));
    return [200, {}, '{}'];
  }, false);

  this.post('/scorm12', function(request) {
    console.lms('LMS Received SCORM 1.2 Commit: \n' +
        JSON.stringify(JSON.parse(request.requestBody), null, 2));
    return [200, {}, '{}'];
  }, false);

  this.post('/aicc', function(request) {
    console.lms('LMS Received AICC Commit: \n' +
        JSON.stringify(JSON.parse(request.requestBody), null, 2));
    return [200, {}, '{}'];
  }, false);
});

const EXISTING_SCORM12 = {
  'cmi': {
    'suspend_data': '2j5c60708090a0b0DC1001512u010120111201212013120141201512G101^1^v_player.6MdNfgnZ6cO.6dTnxCg5TeX1^1^00~2F3~2z3cb101001a1a103vx0~2d2340034003400r78000141^h_default_Disabledr78000141^h_default_Disabledr78000141^h_default_DisabledA780401c1^q_default_Selected_Disabled34003400ZW3IG0P3400340034003400q70020181^g_default_Visited340034000000000002000',
    'launch_data': '',
    'comments': '',
    'comments_from_lms': '',
    'core': {
      'lesson_location': '',
      'credit': '',
      'entry': 'resume',
      'lesson_mode': 'normal',
      'exit': 'suspend',
      'session_time': '00:00:00',
      'score': {
        'raw': '50',
        'min': '0',
        'max': '100',
      },
      'total_time': '00:00:00',
    },
    'objectives': {},
    'student_data': {
      'mastery_score': '',
      'max_time_allowed': '',
      'time_limit_action': '',
    },
    'student_preference': {
      'audio': '',
      'language': '',
      'speed': '',
      'text': '',
    },
    'interactions': {
      '0': {
        'id': 'Scene1_Slide5_MultiChoice_0_0',
        'time': '17:29:39',
        'type': 'choice',
        'weighting': '1',
        'student_response': 'Correct',
        'result': 'correct',
        'latency': '0000:00:18.63',
        'objectives': {
          '0': {
            'id': '',
          },
        },
        'correct_responses': {
          '0': {
            'pattern': 'Correct',
          },
        },
      },
    },
  },
};

const EXISTING_SCORM2004 = {
  'cmi': {
    'comments_from_learner': {},
    'comments_from_lms': {},
    'completion_status': 'incomplete',
    'completion_threshold': '',
    'credit': 'credit',
    'entry': 'resume',
    'exit': 'suspend',
    'interactions': {
      '0': {
        'id': 'Scene1_Slide5_MultiChoice_0_0',
        'type': 'choice',
        'objectives': {
          '0': {
            'id': 'SL360 LMS SCORM 2004',
          },
        },
        'timestamp': '2020-05-25T14:15:32',
        'weighting': '1',
        'learner_response': '',
        'result': 'correct',
        'latency': 'PT1M12.88S',
        'description': 'Which of the answers is correct?',
        'correct_responses': {
          '0': {
            'pattern': 'Correct',
          },
        },
      },
    },
    'launch_data': '',
    'learner_preference': {
      'audio_level': '1',
      'language': '',
      'delivery_speed': '1',
      'audio_captioning': '0',
    },
    'location': '',
    'max_time_allowed': '',
    'mode': 'normal',
    'objectives': {},
    'progress_measure': '',
    'scaled_passing_score': '0.5',
    'score': {
      'scaled': '0.5',
      'raw': '50',
      'min': '0',
      'max': '100',
    },
    'success_status': 'passed',
    'suspend_data': '2i5c60708090a0b0DC1001512u010120111201212013120141201512G101^1^v_player.6MdNfgnZ6cO.6dTnxCg5TeX1^1^00~2E3~2y3cb101001a1a103SV0~2d2340034003400r78000141^h_default_Disabledr78000141^h_default_Disabledr78000141^h_default_DisabledA780401c1^q_default_Selected_Disabled34003400YV28eP3400340034003400q70020181^g_default_Visited340034000000000002000',
    'time_limit_action': 'continue,no message',
    'total_time': 'PT59.94S',
  },
};
