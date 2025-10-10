export function loader() {
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.vizis",
        sha256_cert_fingerprints: [
          "70:97:AB:21:82:65:A5:DE:43:D9:5C:31:7B:93:56:64:30:06:F4:34:97:6C:22:D1:79:15:4E:08:89:22:7D:3E",
        ],
      },
    },
  ];
}
