const templatesByEffort = {
  full: ['birthday-dinner', 'birthday-gift', 'birthday-cinema', 'birthday-card', 'birthday-itinerary'],
  balanced: ['birthday-gift', 'birthday-card', 'birthday-itinerary'],
  minimal: ['birthday-itinerary'],
};

exports.assertTemplateAllowedForEffort = (templateId, effortLevel) => {
  const templates = templatesByEffort[effortLevel];
  if (!templates || !templates.includes(templateId)) {
    throw new Error('The mission template is not enabled for this important date effort level.');
  }
};

exports.templatesByEffort = templatesByEffort;
