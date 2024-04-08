import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const steps = [
  {
    label: "Create an account",
    description: (
      <div className="pe-5">
        The first step to begin the process is by creating an account.{" "}
        <a href="/register" className="link-underline-light">
          Go to our signup form here
        </a>
        .Once you have filled out the form, You will be asked to verify your email. If you are having problems with this step, call us.
      </div>
    )
  },
  {
    label: "Complete your profile",
    description: (
      <div className="pe-5">
        Now that your account has been created, next is to fill out your details on your profile,{" "}
        <a href="/user" className="link-underline-light">
          Click here
        </a>
      </div>
    )
  },
  {
    label: "List your property",
    description: (
      <div className="pe-5">
        If you have a property and would like to list it on our site, you will need to go here and{" "}
        <a href="/landlord/create-listing" className="link-underline-light">
          fill this form
        </a>
      </div>
    )
  },
  {
    label: "Wait for approval",
    description: (
      <div className="pe-5">
        After submitting your form, the next step is to wait for approval. During this stage, a colleague will be reviewing your post, and if it meets the
        standards and rules, we will approve it and add the property to our site for you. Please keep track of the status of your listing by going on your
        dashboard.{" "}
        <a href="/landlord/dashboard" className="link-underline-light">
          Click here to view
        </a>
        .
      </div>
    )
  },
  {
    label: "Finding a tenant",
    description: `If you choose to rent through us, its time to relax and have a piece of mind. Its our turn now. During this stage we will be screening potential tenants for you by 
              checking their details, employment status, etc. To ensure we find you the right tenant.`
  },
  {
    label: "Payments",
    description: `Try out different ad text to see what brings in the most customers,
    and learn how to enhance your ads using features like ad extensions.
    If you run into any problems with your ads, find out how to tell if
    they're running and how to resolve approval issues.`
  }
];

const AboutLandlord = props => {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  return (
    <div>
      <h2 className="fw-bolder mt-5 mx-5 my-5">How-to Guide</h2>
      <div className="mt-2 my-5 mx-5">
        <p className="me-5 fs-6 py-3" style={{ color: "#032830" }}>
          We find you reliable tenants and ensure your proprietary stays in good condition. At TCI Homebase, we offer more than simply listing your properties.
          Browse our list of services available{" "}
          <a href="/products" className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
            here
          </a>
        </p>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel optional={index === 3 ? <Typography variant="caption">Last step</Typography> : null}>{step.label}</StepLabel>
              <StepContent>
                <Typography>{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button variant="contained" onClick={handleNext} sx={{ mt: 1, mr: 1, backgroundColor: "#087990" }}>
                      {index === steps.length - 1 ? "Finish" : "Continue"}
                    </Button>
                    <Button disabled={index === 0} onClick={handleBack} sx={{ mt: 1, mr: 1 }}>
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </div>
    </div>
  );
};

export default connect()(AboutLandlord);
