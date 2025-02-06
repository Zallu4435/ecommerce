const termsAndConditionsData = [
  {
    title: 'Introduction',
    content: `Welcome to [Your Website Name]! These Terms and Conditions govern your use of our website and services. By accessing or using our services, you agree to comply with these terms. Please read them carefully.`
  },
  {
    title: 'Use of Services',
    content: `You must use our website and services in accordance with all applicable laws and regulations. You agree not to engage in any unlawful activity or activities that could harm the website or other users.`
  },
  {
    title: 'User Responsibilities',
    content: (
      <ul className="list-inside list-disc">
        <li>Provide accurate and up-to-date information during registration.</li>
        <li>Maintain the confidentiality of your account and password.</li>
        <li>Be responsible for all activities under your account.</li>
        <li>Refrain from using the services for any harmful or illegal purposes.</li>
      </ul>
    )
  },
  {
    title: 'Privacy Policy',
    content: `Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and protect your personal data.`
  },
  {
    title: 'Content Ownership',
    content: `All content on the website, including text, images, logos, and other materials, are the property of [Your Website Name] or its licensors and are protected by intellectual property laws. You may not use, copy, or distribute the content without proper authorization.`
  },
  {
    title: 'Third-Party Links',
    content: `Our website may contain links to third-party websites that are not controlled or owned by [Your Website Name]. We are not responsible for the content, privacy practices, or actions of these third-party sites.`
  },
  {
    title: 'Termination of Account',
    content: `We reserve the right to suspend or terminate your account if you violate these Terms and Conditions. Upon termination, you may lose access to your account and all associated data.`
  },
  {
    title: 'Limitation of Liability',
    content: `To the fullest extent permitted by law, [Your Website Name] will not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or services.`
  },
  {
    title: 'Changes to Terms',
    content: `We may update these Terms and Conditions at any time. Any changes will be posted on this page, and the date of the last update will be shown at the bottom. By continuing to use our services, you agree to the updated terms.`
  },
  {
    title: 'Governing Law',
    content: `These Terms and Conditions will be governed by and construed in accordance with the laws of [Your Country/State]. Any disputes will be resolved in the appropriate courts within this jurisdiction.`
  },
  {
    title: 'Contact Information',
    content: `If you have any questions or concerns about these Terms and Conditions, please contact us at: [Your Contact Email].`
  }
];

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto mt-10 p-6 dark:bg-gray-900 bg-orange-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 dark:text-white text-gray-600">Terms and Conditions</h1>
      <div className="text-lg space-y-6 dark:text-gray-300 text-gray-700">
        {termsAndConditionsData.map((section, index) => (
          <section key={index} className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-semibold mb-2 dark:text-white text-gray-600">{section.title}</h2>
            <div>{section.content}</div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
