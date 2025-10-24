const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

// State and District API calls
export const fetchStates = async () => {
  try {
    const response = await fetch(`${apiUrl}/Public/state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.status ? data.states : [];
  } catch (error) {
    console.error('Error fetching states:', error);
    return [];
  }
};

export const fetchDistricts = async (stateId: string) => {
  try {
    const response = await fetch(`${apiUrl}/Public/District`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        state_id: stateId
      })
    });
    
    const data = await response.json();
    return data.status ? data.districts : [];
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

// Academic data API calls
export const fetchAcademicData = async (id: string, userId: string, authToken: string, role: string) => {
  try {
    const response = await fetch(`${apiUrl}/${role}/Accounts/Get-Academic-details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        s_id: userId,
        academic_id: id
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching academic data:', error);
    throw error;
  }
};

export const updateAcademicData = async (formData: FormData, id: string, userId: string, authToken: string, role: string) => {
  try {
    const formDataToSend = new FormData();
    
    // Add all form fields
    formDataToSend.append('s_id', String(userId));
    formDataToSend.append('account_id', String(id));
    formDataToSend.append('select_type', formData.selectType);
    formDataToSend.append('select_subtype', formData.selectSubtype || '');
    formDataToSend.append('email', formData.primary_email);
    formDataToSend.append('academic_name', formData.academicName);
    formDataToSend.append('academic_area', formData.area);
    formDataToSend.append('academic_address', formData.academicAddress);
    formDataToSend.append('academic_description', formData.academicDescription);
    formDataToSend.append('academic_pincode', formData.Pincode);
    formDataToSend.append('state_id', formData.selectState);
    formDataToSend.append('district_id', formData.selectDistrict);
    formDataToSend.append('website_url', formData.website_url);
    
    // Contact information
    formDataToSend.append('technicalName', formData.technicalName);
    formDataToSend.append('technicalEmail', formData.technicalEmail);
    formDataToSend.append('technicalPhone', formData.technicalPhone);
    formDataToSend.append('technicalLocation', formData.technicalLocation);
    formDataToSend.append('billingName', formData.billingName);
    formDataToSend.append('billingEmail', formData.billingEmail);
    formDataToSend.append('billingPhone', formData.billingPhone);
    formDataToSend.append('billingLocation', formData.billingLocation);
    formDataToSend.append('additionalName', formData.additionalName);
    formDataToSend.append('additionalEmail', formData.additionalEmail);
    formDataToSend.append('additionalPhone', formData.additionalPhone);
    formDataToSend.append('additionalLocation', formData.additionalLocation);
    
    // Domain configuration
    formDataToSend.append('configured', formData.configure === "1" ? "1" : "0");
    formDataToSend.append('configured_domain', formData.domainName);
    
    // Templates
    formDataToSend.append('template_id', formData.templateData?.id || "22");
    formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
    formDataToSend.append('sms_template', formData.smsTemplate);
    formDataToSend.append('email_template', formData.emailTemplate);
    
    // API keys
    formDataToSend.append('wtsp_api_key', formData.wPassword);
    formDataToSend.append('sms_api_key', formData.smsApikey);
    formDataToSend.append('razorpay_api_key', formData.razorpayApikey);
    formDataToSend.append('razorpay_secret_key', formData.razorpaySecretkey);
    formDataToSend.append('zoho_api_key', formData.zohoApiKey);
    formDataToSend.append('zoho_from_email', formData.zohoFromEmail);
    formDataToSend.append('bounce_address', formData.bounceAddress);
    
    // Permissions
    formDataToSend.append('hallticket_generate_permission', formData.switchState ? "1" : "0");
    formDataToSend.append('nominal_permission', formData.nominalState ? "1" : "0");
    formDataToSend.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? "1" : "0");
    formDataToSend.append('whatsapp_details_enable', formData.isTemplatesVisible ? "1" : "0");
    formDataToSend.append('sms_details_enable', formData.isSmsApiEnabled ? "1" : "0");
    
    // Logo file
    if (formData.academicLogo) {
      formDataToSend.append('academic_logo', formData.academicLogo);
    }

    const response = await fetch(`${apiUrl}/${role}/Accounts/live-Account-Update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formDataToSend
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating academic data:', error);
    throw error;
  }
};


export const addLiveAccount = async (formData: FormData, userId: string, authToken: string, role: string) => {
  try {
    const formDataToSend = new FormData();

    // Basic academic information
    formDataToSend.append('s_id', userId);
    formDataToSend.append('select_type', formData.selectType);
    formDataToSend.append('select_subtype', formData.selectSubtype || '');
    formDataToSend.append('email', formData.primary_email);
    formDataToSend.append('academic_name', formData.academicName);
    formDataToSend.append('academic_area', formData.area);
    formDataToSend.append('academic_address', formData.academicAddress);
    formDataToSend.append('academic_description', formData.academicDescription);
    formDataToSend.append('academic_pincode', formData.Pincode);
    formDataToSend.append('state_id', formData.selectState);
    formDataToSend.append('district_id', formData.selectDistrict);
    formDataToSend.append('website_url', formData.website_url);

    // Contact information
    const technicalContact = {
      name: formData.technicalName,
      email: formData.technicalEmail,
      phone: formData.technicalPhone,
      location: formData.technicalLocation
    };
    const billingContact = {
      name: formData.billingName,
      email: formData.billingEmail,
      phone: formData.billingPhone,
      location: formData.billingLocation
    };
    const additionalContact = {
      name: formData.additionalName,
      email: formData.additionalEmail,
      phone: formData.additionalPhone,
      location: formData.additionalLocation
    };

    formDataToSend.append('technicalName', JSON.stringify(technicalContact));
    formDataToSend.append('billingName', JSON.stringify(billingContact));
    formDataToSend.append('additionalName', JSON.stringify(additionalContact));

    // Domain configuration
    formDataToSend.append('configured', formData.configure);
    formDataToSend.append('configured_domain', formData.domainName);

    // Templates
    formDataToSend.append('whatsapp_template', formData.whatsappTemplate);
    formDataToSend.append('sms_template', formData.smsTemplate);
    formDataToSend.append('email_template', formData.emailTemplate);

    // API Keys and credentials
    formDataToSend.append('wtsp_api_key', formData.wPassword);
    formDataToSend.append('sms_api_key', formData.smsApikey);
    formDataToSend.append('razorpay_api_key', formData.razorpayApikey);
    formDataToSend.append('razorpay_secret_key', formData.razorpaySecretkey);
    formDataToSend.append('zoho_api_key', formData.zohoApiKey);
    formDataToSend.append('zoho_from_email', formData.zohoFromEmail);
    formDataToSend.append('bounce_address', formData.bounceAddress);

    // Permissions
    formDataToSend.append('hallticket_generate_permission', formData.switchState ? "1" : "0");
    formDataToSend.append('nominal_permission', formData.nominalState ? "1" : "0");
    formDataToSend.append('rankcard_permission', formData.rankCardState ? "1" : "0");
    formDataToSend.append('email_service_dropdown_enabled', formData.isDropdownEnabled ? "1" : "0");
    formDataToSend.append('whatsapp_details_enable', formData.isTemplatesVisible ? "1" : "0");
    formDataToSend.append('sms_details_enable', formData.isSmsApiEnabled ? "1" : "0");

    // Logo file
    if (formData.academicLogo) {
      formDataToSend.append('academic_logo', formData.academicLogo);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${role}/Accounts/Add-live-accouunts`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'accept': 'application/json',
        },
        body: formDataToSend,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error adding live account:', error);
    throw error;
  }
};