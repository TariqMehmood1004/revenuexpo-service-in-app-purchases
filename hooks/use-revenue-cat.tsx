import { useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, {
    CustomerInfo,
    PurchasesOffering
} from "react-native-purchases";


// TODO: API for RevenueCat service
const API_KEYS = {
    apple: process.env.EXPO_PUBLIC_REVENUECATALOG_APPLE_KEY || "",
    google: process.env.EXPO_PUBLIC_REVENUECATALOG_GOOGLE_KEY || ""
};

// TODO: Define membership types based on RevenueCat configuration
const MEMBERSHIP_TYPES = {
    monthly: "proMonthly",
    yearly: "proYearly"
};

function useRevenueCatService() {
    const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
    const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

    // TODO: Determine if user is a Pro member based on active subscriptions
    const isMemberPro = 
        customerInfo?.activeSubscriptions.includes(MEMBERSHIP_TYPES.monthly) ||
        customerInfo?.activeSubscriptions.includes(MEMBERSHIP_TYPES.yearly);

    // TODO: Fetch offerings and customer info on component mount
    useEffect(() => {
        const fetchData = async () => {
            Purchases.setDebugLogsEnabled(true);

            // Assign API key based on platform
            if(Platform.OS === "android") {
                Purchases.configure({ apiKey: API_KEYS.google });
            } else {
                Purchases.configure({ apiKey: API_KEYS.apple });
            }

            // TODO: Fetch offerings and customer info from RevenueCat
            const offerings = await Purchases.getOfferings();
            const customerInfo = await Purchases.getCustomerInfo();

            // TODO: Set offerings and customer info
            setCustomerInfo(customerInfo);
            setCurrentOffering(offerings.current);
        };

        // TODO: Handle errors during data fetching
        fetchData().catch(console.error);
    }, []);

    // TODO: Listen for updates to offerings and customer info
    useEffect(() => {
        const customerInfoUpdated = async (purchaseInfo: CustomerInfo) => {
            setCustomerInfo(purchaseInfo);
        };

        Purchases.addCustomerInfoUpdateListener(customerInfoUpdated);
    }, []);

    // TODO: Return relevant data and functions for use in components
    return {
        currentOffering,
        customerInfo,
        isMemberPro
    };
}

export default useRevenueCatService;