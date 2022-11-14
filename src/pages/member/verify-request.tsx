import {  NextPage } from "next";
import React from "react";
import { Layout } from "../../components/Layout";

const VerifyRequest: NextPage = () =>  {
    return <Layout>
      <div className="flex gap-4 flex-col max-w-sm m-auto border border-site-brand-500 rounded px-8 py-4">
      Check your email
      A sign in link has been sent to your email address.


      </div>
    </Layout>
}

export default VerifyRequest;
