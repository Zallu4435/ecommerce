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
    <div className="flex dark:bg-black h-screen fixed top-10 left-[420px] right-0">
      <div className="p-6 w-full px-14 dark:bg-gray-900 dark:text-white bg-orange-50 overflow-y-auto scrollbar-hidden pb-20">
        {/* Page Header */}
        <div className="flex justify-between mt-5 items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-400">
            Terms & Conditions
          </h1>
        </div>

        <div className="max-w-4xl space-y-8">
          {termsAndConditionsData.map((section, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-sm">
                  {index + 1}
                </span>
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                {section.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
