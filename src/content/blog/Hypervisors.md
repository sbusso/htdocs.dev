---
title: Hypervisors
author:
  - Stephane Busso
description: Each of these modern hypervisor and container technologies serves specific needs in cloud-native, edge computing, and containerized environments
published: true
tags:
  - firecracker
  - hypervisors
  - kvm
  - qemu
updated: 2025-02-15T23:18
created: 2024-08-17T19:45
cover: 
---
A **hypervisor**, also known as a **virtual machine monitor** (**VMM**) or **virtualizer**, is a type of computer [software](https://en.wikipedia.org/wiki/Software "Software"), [firmware](https://en.wikipedia.org/wiki/Firmware "Firmware") or [hardware](https://en.wikipedia.org/wiki/Computer_hardware "Computer hardware") that creates and runs [virtual machines](https://en.wikipedia.org/wiki/Virtual_machine "Virtual machine"). A computer on which a hypervisor runs one or more virtual machines is called a _host machine_, and each virtual machine is called a _guest machine_. The hypervisor presents the guest operating systems with a [virtual operating platform](https://en.wikipedia.org/wiki/Platform_virtualization "Platform virtualization") and manages the execution of the guest operating systems. Unlike an [emulator](https://en.wikipedia.org/wiki/Emulator "Emulator"), the guest executes most instructions on the native hardware.[1](1.md)(https://en.wikipedia.org/wiki/Hypervisor#cite_note-goldberg1973-1) Multiple instances of a variety of operating systems may share the virtualized hardware resources: for example, [Linux](https://en.wikipedia.org/wiki/Linux "Linux"), [Windows](https://en.wikipedia.org/wiki/Microsoft_Windows "Microsoft Windows"), and [macOS](https://en.wikipedia.org/wiki/MacOS "MacOS") instances can all run on a single physical [x86](https://en.wikipedia.org/wiki/X86 "X86") machine. This contrasts with [operating-system–level virtualization](https://en.wikipedia.org/wiki/Operating-system-level_virtualization "Operating-system-level virtualization"), where all instances (usually called _containers_) must share a single kernel, though the guest operating systems can differ in [user space](https://en.wikipedia.org/wiki/User_space "User space"), such as different [Linux distributions](https://en.wikipedia.org/wiki/Linux_distribution "Linux distribution") with the same kernel.

The term _hypervisor_ is a variant of _supervisor_, a traditional term for the [kernel](https://en.wikipedia.org/wiki/Kernel_(operating_system) "Kernel (operating system)") of an [operating system](https://en.wikipedia.org/wiki/Operating_system "Operating system"): the hypervisor is the supervisor of the supervisors,[2](2.md)(https://en.wikipedia.org/wiki/Hypervisor#cite_note-2) with _[hyper-](https://en.wiktionary.org/wiki/hyper- "wikt:hyper-")_ used as a stronger variant of _[super-](https://en.wiktionary.org/wiki/super- "wikt:super-")_.[a](a.md)(https://en.wikipedia.org/wiki/Hypervisor#cite_note-3) The term dates to circa 1970;[3](3.md)(https://en.wikipedia.org/wiki/Hypervisor#cite_note-4) IBM coined it for the [360/65](https://en.wikipedia.org/wiki/IBM_System/360_Model_65 "IBM System/360 Model 65")[4](4.md)(https://en.wikipedia.org/wiki/Hypervisor#cite_note-5) and later used it for the DIAG handler of CP-67. In the earlier [CP/CMS](https://en.wikipedia.org/wiki/CP/CMS "CP/CMS") (1967) system, the term _Control Program_ was used instead.

Here's a comprehensive list of hypervisors available today, including their key features, advantages, and use cases:


### **1. KVM (Kernel-based Virtual Machine)**
- **Type**: Type-1 (Bare-metal) / Type-2 (Hosted) Hypervisor
- **Platform**: Linux
- **Key Features**:
  - Integrated into the Linux kernel, providing low overhead and high performance.
  - Supports various guest operating systems, including Linux, Windows, and BSD.
  - Works with QEMU to provide a complete virtualization environment.
- **Advantages**:
  - High performance due to tight integration with the Linux kernel.
  - Open-source and widely supported by the community and commercial vendors.
  - Scales well from individual VMs to large cloud environments.
- **Use Cases**:
  - Data centers, cloud providers, enterprise virtualization, and development environments.

### **2. QEMU (Quick EMUlator)**
- **Type**: Type-2 (Hosted) Hypervisor
- **Platform**: Cross-platform (Linux, Windows, macOS)
- **Key Features**:
  - Full system emulation, capable of emulating a complete machine.
  - Can run without KVM but is often used together with KVM for hardware-accelerated virtualization.
  - Supports a wide range of architectures, including x86, ARM, RISC-V, and others.
- **Advantages**:
  - Highly versatile and flexible, supporting various CPU architectures.
  - Useful for cross-platform development and testing.
  - Open-source and widely used in the open-source community.
- **Use Cases**:
  - Embedded systems development, cross-platform development, and testing environments.

### **3. VMware ESXi**
- **Type**: Type-1 (Bare-metal) Hypervisor
- **Platform**: VMware-specific hardware and x86 architecture
- **Key Features**:
  - Enterprise-grade hypervisor with a rich set of management tools.
  - Supports high availability, fault tolerance, and distributed resource scheduling.
  - Integrated with the VMware vSphere suite for advanced management.
- **Advantages**:
  - Proven stability and performance in enterprise environments.
  - Extensive ecosystem with strong support and integration options.
  - High availability and disaster recovery features.
- **Use Cases**:
  - Enterprise data centers, cloud environments, and virtual desktop infrastructure (VDI).

### **4. Microsoft Hyper-V**
- **Type**: Type-1 (Bare-metal) Hypervisor
- **Platform**: Windows Server
- **Key Features**:
  - Built into Windows Server, providing seamless integration with Windows environments.
  - Supports both Windows and Linux guest operating systems.
  - Includes features like live migration, high availability, and replication.
- **Advantages**:
  - Native integration with Windows environments, including Active Directory and System Center.
  - Easy to manage and deploy in Windows-centric infrastructures.
  - Supports nested virtualization and containers.
- **Use Cases**:
  - Enterprise environments using Windows Server, hybrid cloud deployments, and VDI.

### **5. Xen**
- **Type**: Type-1 (Bare-metal) Hypervisor
- **Platform**: Linux, FreeBSD, NetBSD
- **Key Features**:
  - Open-source hypervisor with support for paravirtualization and hardware-assisted virtualization.
  - Highly customizable and used by many cloud providers, including Amazon EC2.
  - Supports live migration, high availability, and multi-tenant environments.
- **Advantages**:
  - Strong isolation and security features.
  - Used by large-scale cloud providers for its scalability and performance.
  - Open-source with a large community and commercial support options.
- **Use Cases**:
  - Cloud providers, enterprise virtualization, and secure multi-tenant environments.

### **6. Oracle VM VirtualBox**
- **Type**: Type-2 (Hosted) Hypervisor
- **Platform**: Cross-platform (Linux, Windows, macOS)
- **Key Features**:
  - User-friendly and versatile, supporting a wide range of guest operating systems.
  - Includes features like snapshots, shared folders, and seamless mode.
  - Supports virtualization on both desktops and servers.
- **Advantages**:
  - Easy to use with a GUI for managing VMs.
  - Supports a wide range of guest OSes and is ideal for developers and testers.
  - Free and open-source, with a large user community.
- **Use Cases**:
  - Desktop virtualization, development and testing, and educational environments.

### **7. Hyperkit**
- **Type**: Type-2 (Hosted) Hypervisor
- **Platform**: macOS
- **Key Features**:
  - Lightweight hypervisor built for macOS, based on the macOS Hypervisor.framework.
  - Designed for use with Docker for Mac and other container solutions.
  - Integrates well with other macOS tools and environments.
- **Advantages**:
  - Native performance on macOS.
  - Lightweight and minimal, making it ideal for container-based workloads on macOS.
  - Open-source with active development.
- **Use Cases**:
  - Docker-based development on macOS, lightweight VM management.

### **8. Parallels Desktop**
- **Type**: Type-2 (Hosted) Hypervisor
- **Platform**: macOS
- **Key Features**:
  - Optimized for running Windows and Linux VMs on macOS.
  - Includes features like Coherence Mode, which allows Windows applications to run seamlessly on macOS.
  - Integrates well with macOS features and provides high performance.
- **Advantages**:
  - Excellent integration with macOS, providing a seamless user experience.
  - Optimized for performance, especially for running Windows on Mac.
  - Commercial product with strong support and regular updates.
- **Use Cases**:
  - Running Windows or Linux on macOS, development and testing, and business environments.

### **9. Firecracker**
- **Type**: Type-1 (Bare-metal) / Micro VM Manager
- **Platform**: Linux
- **Key Features**:
  - Designed for creating and managing micro VMs for serverless computing.
  - Minimalist design focused on fast boot times and low resource consumption.
  - Provides strong security and isolation while maintaining performance.
- **Advantages**:
  - Extremely lightweight with low overhead.
  - Optimized for serverless environments and microservice architectures.
  - Open-source with strong community backing.
- **Use Cases**:
  - Serverless computing platforms, microservice deployment, and containerized environments.

### **10. bhyve**
- **Type**: Type-1 (Bare-metal) Hypervisor
- **Platform**: FreeBSD
- **Key Features**:
  - Native hypervisor for FreeBSD, supporting a variety of guest OSes, including Linux, Windows, and others.
  - Lightweight and integrated into FreeBSD, providing low overhead.
  - Supports features like PCI pass-through and UEFI boot.
- **Advantages**:
  - Native to FreeBSD with low overhead.
  - Supports a range of guest operating systems.
  - Open-source and well-integrated with FreeBSD's ecosystem.
- **Use Cases**:
  - FreeBSD-based virtualization, server environments, and cloud deployments.

### **11. UTM**
- **Type**: Type-2 (Hosted) Hypervisor
- **Platform**: macOS, iOS
- **Key Features**:
  - Built on QEMU and Apple’s Hypervisor.framework, offering a user-friendly interface for macOS and iOS.
  - Supports running various operating systems, including Linux, Windows, and macOS.
  - Provides a GUI for managing VMs and integrates well with macOS.
- **Advantages**:
  - Easy to use, especially on macOS and iOS devices.
  - Leverages the performance of Apple’s Hypervisor.framework.
  - Open-source and community-driven.
- **Use Cases**:
  - Desktop virtualization on macOS, mobile virtualization on iOS.

### **12. Virtuozzo**
- **Type**: Type-1 (Bare-metal) Hypervisor
- **Platform**: Linux
- **Key Features**:
  - Focuses on container-based virtualization with support for VMs.
  - Includes features like live migration, high availability, and snapshotting.
  - Integrated with cloud and hosting platforms.
- **Advantages**:
  - Combines container and VM management in a single platform.
  - Optimized for service providers and cloud environments.
  - Commercial product with strong support and enterprise features.
- **Use Cases**:
  - Cloud hosting, managed services, and hybrid virtualization environments.

### **Comparison of Hypervisors**

1. **Performance**: 
   - **KVM**, **VMware ESXi**, and **Hyper-V** generally offer the best performance due to their tight integration with hardware.
   - **Firecracker** provides excellent performance for micro VMs with minimal overhead.

2. **Ease of Use**:
   - **Oracle VM VirtualBox** and **Parallels Desktop** are known for their user-friendly interfaces, making them ideal for desktop users.
   - **UTM** and **Hyperkit** are optimized for macOS environments and are easy to use on Apple devices.

3. **Scalability**:
   - **Xen**, **KVM**, and **VMware ESXi** are widely used in large-scale cloud environments and can scale to thousands of VMs.
   - **Firecracker** is optimized for scaling serverless functions and microservices.

4. **Security**:
   - **KVM** and **Xen** offer robust security features, including strong isolation and support for secure multi-tenancy.
   - **Kata Containers** and **Firecracker** are designed with a focus on security, offering enhanced isolation for containerized workloads.

5. **Cost**:
   - **KVM**, **QEMU**, and **Xen** are open-source and free, making them cost-effective solutions.
   - **VMware ESXi** and **Parallels Desktop** are commercial products that require licensing.

6. **Platform Integration**:
   - **Hyper-V** integrates seamlessly with Windows environments.
   - **bhyve** is the go-to choice for FreeBSD users.

Choosing the right hypervisor depends on your specific requirements, including the target environment, performance needs, and the level of integration required.

**Cloud Hypervisor Overview**

• **Type**: Type-1 (Bare-metal) Hypervisor

• **Platform**: Linux

• **Key Features**:

• **Lightweight and Minimal**: Designed to run workloads with minimal overhead, Cloud Hypervisor provides a streamlined experience, focusing only on what’s necessary for cloud environments.

• **Security-First**: Built with modern security practices in mind, such as memory encryption and secure boot, ensuring strong isolation between VMs.

• **Optimized for Cloud Workloads**: Supports modern cloud workloads, including containers, microservices, and serverless computing.

• **VMM (Virtual Machine Manager)**: Cloud Hypervisor uses Rust for its VMM, benefiting from Rust’s memory safety features to reduce vulnerabilities.

• **Integration with Kata Containers**: Cloud Hypervisor is often paired with Kata Containers to provide lightweight VM-based isolation for container workloads.


In addition to Cloud Hypervisor, several other modern hypervisors and similar technologies have emerged, specifically designed for cloud-native, containerized, and edge computing environments. These technologies prioritize lightweight, secure, and efficient virtualization tailored to modern application needs. Here’s an overview of some of these technologies:

### QEMU microvm
https://www.qemu.org/docs/master/system/i386/microvm.html
`microvm` is a machine type inspired by `Firecracker` and constructed after its machine model.

### **1. Firecracker**
- **Type**: MicroVM-based Hypervisor
- **Developer**: Amazon Web Services (AWS)
- **Key Features**:
  - **MicroVMs**: Designed to launch microVMs in milliseconds with minimal memory overhead.
  - **Security**: Built with strong security features, including jailer processes and minimal attack surface.
  - **Use Cases**: Primarily used for serverless computing platforms like AWS Lambda and AWS Fargate, where quick, efficient, and isolated execution environments are needed.
  - **Integration**: Works well with containerized workloads and can be a drop-in replacement for traditional container runtimes.

### **2. Kata Containers**
- **Type**: Lightweight Virtualization for Containers
- **Developer**: OpenStack Foundation
- **Key Features**:
  - **VM Isolation for Containers**: Provides stronger isolation than traditional containers by running each container inside a lightweight VM.
  - **Compatibility**: Designed to work seamlessly with existing container runtimes like Docker and Kubernetes, though Kubernetes is not required.
  - **Security**: Focuses on security by using hardware virtualization for container workloads, offering better isolation than namespaces and cgroups alone.
  - **Performance**: Optimized to provide near-native performance for containerized applications.

### **3. gVisor**
- **Type**: Container Sandbox
- **Developer**: Google
- **Key Features**:
  - **User-Space Kernel**: Implements a user-space kernel that provides a secure sandbox for running containers.
  - **Security**: Designed to intercept and handle system calls from containers, reducing the risk of kernel exploits.
  - **Integration**: Can be used as a drop-in replacement for Docker’s runtime (runc), offering enhanced security without the overhead of full virtualization.
  - **Use Cases**: Particularly useful in multi-tenant environments where strong isolation between containers is required.



### **4. Nabla Containers**
- **Type**: Library OS-Based Container Runtime
- **Developer**: IBM Research
- **Key Features**:
  - **Minimal Attack Surface**: Runs each container with only the necessary system calls and resources, reducing the attack surface.
  - **Library OS**: Utilizes a library OS to run applications with a minimalistic and isolated environment.
  - **Security and Performance**: Balances strong security with lightweight performance, similar to unikernels but within a container runtime.

### **5. Unikernels**
- **Type**: Specialized, Single-Purpose VM
- **Developer**: Various (e.g., MirageOS, IncludeOS, OSv)
- **Key Features**:
  - **Single-Purpose VMs**: Compiles an application along with only the necessary OS components into a single-purpose VM.
  - **Performance and Security**: Offers high performance due to the minimalistic approach, with a reduced attack surface compared to traditional VMs or containers.
  - **Use Cases**: Ideal for cloud and edge environments where resource efficiency and security are critical.

### **6. Virtlet**
- **Type**: Kubernetes CRI (Container Runtime Interface) Implementation
- **Developer**: Mirantis
- **Key Features**:
  - **VMs in Kubernetes**: Allows running traditional VMs alongside containers in Kubernetes clusters.
  - **Compatibility**: Enables using VMs in Kubernetes environments where certain workloads may not be containerized.
  - **Flexibility**: Supports scenarios where both containerized and non-containerized workloads need to coexist.

### **7. WasmEdge**
- **Type**: WebAssembly Runtime
- **Developer**: Second State
- **Key Features**:
  - **WebAssembly (Wasm)**: Designed to run Wasm modules efficiently, providing a lightweight and portable execution environment.
  - **Security**: Offers strong isolation similar to containers, but with a much smaller footprint and faster startup times.
  - **Use Cases**: Ideal for serverless functions, edge computing, and microservices where lightweight and fast execution is essential.

### **8. AWS Nitro Enclaves**
- **Type**: Enclave-Based Hypervisor
- **Developer**: Amazon Web Services (AWS)
- **Key Features**:
  - **Secure Enclaves**: Provides isolated compute environments (enclaves) within EC2 instances, leveraging the Nitro Hypervisor.
  - **Use Cases**: Designed for processing highly sensitive data with enhanced security, such as cryptographic operations, key management, and confidential computing.

### **9. VMWare ESXi on ARM**
- **Type**: Bare-Metal Hypervisor
- **Developer**: VMware
- **Key Features**:
  - **ARM Support**: Offers ESXi hypervisor capabilities on ARM architecture, targeting edge and IoT devices.
  - **Lightweight Virtualization**: Tailored for lightweight and low-power devices while still providing enterprise-level virtualization features.
  - **Use Cases**: Suitable for edge computing, embedded systems, and environments where x86 hardware may be overkill.



<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="undefined" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://www.gallium.cloud/" target="_blank" class="text-blue-600 hover:underline">Gallium | Home</a>
    </div>
    <p class="text-gray-600">Gallium is a new Cloud-Managed Hypervisor that enables effortless on-prem Virtualisation</p>
  </div>
</div>




<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="undefined" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://crosvm.dev/book/" target="_blank" class="text-blue-600 hover:underline">Introduction - Book of crosvm</a>
    </div>
    <p class="text-gray-600">undefined</p>
  </div>
</div>




<div class="p-4 flex">
  <div class="w-24 h-24 mr-4 flex-shrink-0">
    <img src="https://opengraph.githubassets.com/21a16cb13bfacc4683331d09203a224e9e29695eb5f684adf1e2396b5f18aefd/liquidmetal-dev/flintlock" alt="Preview Image" class="w-full h-full object-cover rounded">
  </div>
  <div>
    <div class="text-xl font-semibold mb-2 flex items-center">
      <a href="https://github.com/liquidmetal-dev/flintlock" target="_blank" class="text-blue-600 hover:underline">liquidmetal-dev/flintlock: Lock, Stock, and Two Smoking MicroVMs. Create and manage the lifecycle of MicroVMs backed by containerd.</a>
    </div>
    <p class="text-gray-600">Lock, Stock, and Two Smoking MicroVMs. Create and manage the lifecycle of MicroVMs backed by containerd. - liquidmetal-dev/flintlock</p>
  </div>
</div>



### **Comparison and Considerations**
- **Performance**: Unikernels and Firecracker excel in performance due to their minimalistic approach. Kata Containers and Cloud Hypervisor also offer near-native performance for containerized workloads.
- **Security**: gVisor, Kata Containers, and Firecracker focus heavily on security by providing strong isolation with minimal attack surfaces.
- **Use Case Fit**: Depending on the workload (e.g., serverless functions, microservices, or traditional VMs), each of these technologies offers unique advantages.
- **Resource Efficiency**: WasmEdge and Firecracker are highly efficient in terms of resource usage, making them ideal for edge computing and highly scalable cloud environments.

### Conclusion
Each of these modern hypervisor and container technologies serves specific needs in cloud-native, edge computing, and containerized environments. Depending on your use case—whether it's maximizing performance, ensuring security, or efficiently managing resources—choosing the right technology involves balancing these factors with the requirements of your specific deployment environment.